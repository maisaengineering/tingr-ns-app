import {Component, ViewContainerRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {CalendarService, Schedule, Birthday, EventReminder, Holiday, Message} from "../../shared/calendar.service";
import {TeacherInfo} from "../../providers/data/teacher_info";
import {MyClassService, ManagedKid, Room} from "../../shared/myclass.service";
import * as dialogs from "ui/dialogs";
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ModalDatePicker} from "../../pages/dialogs/modal-date-picker";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import {Router, NavigationExtras} from "@angular/router";
import firebase = require("nativescript-plugin-firebase");
let app = require("application");
let platform = require("platform");


@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./calendar.css'],
    templateUrl: './calendar.component.html',
    providers: [CalendarService, MyClassService, ModalDialogService, ServerErrorService]
})
export class CalendarComponent extends DrawerPage implements OnInit {
    public schedules: Array<Schedule>;
    public birthdays: Array<Birthday>;
    public event_reminders: Array<EventReminder>;
    public holidays: Array<Holiday>;
    public messages: Array<Message>;
    public currentDate: Date;
    public teacherName: String;
    public result: Date;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public iscurrentDateSelected: Boolean = false;
    public showActionBarItems: Boolean = false;

    public currentRoom: any;
    public roomName: String;
    public assignedRooms: Array<any>;
    public moreThanOneRoom: Boolean = false;

    constructor(private myClassService: MyClassService,
                private changeDetectorRef: ChangeDetectorRef,
                private modal: ModalDialogService, private vcRef: ViewContainerRef,
                private calendarService: CalendarService,
                private internetService: InternetService,
                private router: Router,
                private serverErrorService: ServerErrorService) {
        super(changeDetectorRef);

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }

        this.currentDate = new Date();
        this.schedules = [];
        this.birthdays = [];
        this.event_reminders = [];
        this.holidays = [];
        this.messages = [];

        this.currentRoom = TeacherInfo.parsedCurrentRoom;
        this.roomName = this.currentRoom.session_name;
        // initialize with when user logged in data and then invoke assignedrooms api to get updated ones
        //this.assignedRooms = TeacherInfo.parsedDetails.rooms;
        this.assignedRooms = [];
    }

    createModalDatePickerView() {
        this.iscurrentDateSelected = true;
        let that = this;
        let currentDate = new Date();
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: currentDate.toDateString(),
            fullscreen: false
        };
        // >> returning-result
        this.modal.showModal(ModalDatePicker, options)
            .then((dateresult: Date) => {
                this.iscurrentDateSelected = false;
                if (dateresult) {
                    this.loadCalendarDataByDay(dateresult, this.currentRoom);
                }
            })
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline(); 
        this.loadCalendarDataByDay(this.currentDate, this.currentRoom);
        this.getAssignedRooms();
    }

    getAssignedRooms() {
        this.myClassService.getAssignedRooms().subscribe(
            (result) => {
                this.assignedRooms = result.body.rooms;
                if(this.assignedRooms.length > 1){
                    this.moreThanOneRoom = true;
                }
                this.changeDetectorRef.markForCheck();
            },
            (error) => {
                this.isLoading = false;
                //this.serverErrorService.showErrorModal();
            }
        );
    }

    openRooms() {
        let rooms = this.assignedRooms;
        if(rooms.length < 2) {
            return;
        }
        let actions = [];
        for (let room of rooms) {
            actions.push(room.session_name);
        }
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: actions
        }).then(result => {
            if (result !== 'Cancel') {
                // don't fetch data if clicks on same room
                if (this.roomName != result) {
                    this.currentRoom = rooms.filter(report => report.session_name === result)[0];
                    // save the selected room in application data to access application wide
                    TeacherInfo.currentRoom = JSON.stringify(this.currentRoom);
                    this.roomName = this.currentRoom.session_name;
                    this.loadCalendarDataByDay(this.currentDate, this.currentRoom);
                    this.changeDetectorRef.markForCheck();
                }
            }


        });
    }


    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.calendarService.getCalendarData(this.currentDate, this.currentRoom)
            .subscribe((result) => {
                    let body = result.body;
                    this.schedules = body.events;
                    this.messages = body.messages;
                    let reminders = body.reminders;
                    this.birthdays = reminders.birthdays;
                    this.event_reminders = reminders.event_reminders;
                    this.holidays = reminders.holidays;

                    // stop pull to refresh
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    pullRefresh.refreshing = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    loadCalendarDataByDay(currentDate, room) {
        this.currentDate = currentDate;
        this.isLoading = true;
        this.calendarService.getCalendarData(currentDate, room)
            .subscribe((result) => {
                    let body = result.body;
                    this.schedules = body.events;
                    this.messages = body.messages;
                    let reminders = body.reminders;
                    this.birthdays = reminders.birthdays;
                    this.event_reminders = reminders.event_reminders;
                    this.holidays = reminders.holidays;
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    openMessageConversation(message) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "conversationKlId": message.conversation_klid
            }
        };
        this.router.navigate(["messages"], navigationExtras);
    }


    // check if local current time is b/w schedule start and end times
    isScheduleTimeIsCurrent(scheduleStartTimeStr, scheduleEndTimeStr) {
        // convert api time to localtime
        let scheduleStartTime = new Date(scheduleStartTimeStr);
        let scheduleEndTime = new Date(scheduleEndTimeStr);
        let today = new Date();

        if(this.currentDate.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
            // to get timestamp like '11:1:10';
            // add padding zero
            let startTime = ("0" + scheduleStartTime.getHours()).slice(-2) +
                ":" + ("0" + scheduleStartTime.getMinutes()).slice(-2) + ":"
                + ("0" + scheduleStartTime.getSeconds()).slice(-2);

            let endTime = ("0" + scheduleEndTime.getHours()).slice(-2) +
                ":" + ("0" + scheduleEndTime.getMinutes()).slice(-2) + ":"
                + ("0" + scheduleEndTime.getSeconds()).slice(-2);

            let currentDate = new Date();
            let startDate = new Date(currentDate.getTime());

            startDate.setHours(parseInt(startTime.split(":")[0]));
            startDate.setMinutes(parseInt(startTime.split(":")[1]));
            startDate.setSeconds(parseInt(startTime.split(":")[2]));

            let endDate = new Date(currentDate.getTime());
            endDate.setHours(parseInt(endTime.split(":")[0]));
            endDate.setMinutes(parseInt(endTime.split(":")[1]));
            endDate.setSeconds(parseInt(endTime.split(":")[2]));
            let valid = startDate < currentDate && endDate > currentDate;
            return valid;
        }else{
           return false;
        }

    }

    openDescription(description) {
        dialogs.alert({
            title: "",
            message: description,
            okButtonText: "Ok"
        }).then(() => {
            //console.log("Dialog closed!");
        });
    }
}