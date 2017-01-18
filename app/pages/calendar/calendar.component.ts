import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {CalendarService, Schedule, Birthday, EventReminder, Holiday, Message} from "../../shared/calendar.service";

import {ListView} from 'ui/list-view';
import {TextView} from 'ui/text-view';

import {TeacherInfo} from "../../providers/data/teacher_info";
import * as dialogs from "ui/dialogs";
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ModalDatePicker} from "../../pages/dialogs/modal-date-picker";
import {InternetService} from "../../shared/internet.service";
import {DatePicker} from "ui/date-picker";
import {Page} from "ui/page";

var app = require("application");
var platform = require("platform");
var frameModule = require("ui/frame");


@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./calendar.css'],
    templateUrl: './calendar.component.html',
    providers: [CalendarService, ModalDialogService]
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

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private modal: ModalDialogService, private vcRef: ViewContainerRef,
                private calendarService: CalendarService,
                private internetService: InternetService) {
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
        var teacherDetails = TeacherInfo.parsedDetails;
        this.teacherName = teacherDetails.fname + ' ' + teacherDetails.lname;
    }

    static entries = [
        ModalDatePicker
    ];

    static exports = [
        ModalDatePicker
    ];


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
                    this.loadCalendarDataByDay(dateresult);
                }
            })
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();

        // Hide 'Default Back button'
        if (this.isIos) {
            var controller = frameModule.topmost().ios.controller;
            // get the view controller navigation item
            var navigationItem = controller.visibleViewController.navigationItem;
            // hide back button
            navigationItem.setHidesBackButtonAnimated(true, false);
        }
        // load data
        this.loadCalendarDataByDay(this.currentDate);
    }


    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.calendarService.getCalendarData(this.currentDate)
            .subscribe((result) => {
                    let body = result.body;
                    this.schedules = body.events;
                    this.messages = body.messages;
                    let reminders = body.reminders;
                    this.birthdays = reminders.birthdays;
                    this.event_reminders = reminders.event_reminders;
                    this.holidays = reminders.holidays;
                    // stop pull to refresh
                    setTimeout(function () {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    pullRefresh.refreshing = false;
                    alert('Internal server error.');
                }
            );
    }

    loadCalendarDataByDay(currentDate) {
        this.currentDate = currentDate;
        this.isLoading = true;
        this.calendarService.getCalendarData(currentDate)
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
                    alert('Internal server error.');

                }
            );
    }

    // check if local current time is b/w schedule start and end times
    isScheduleTimeIsCurrent(scheduleStartTimeStr, scheduleEndTimeStr) {
        //console.log(" scheduleStartTimeStr "+ scheduleStartTimeStr);
        //console.log(" scheduleEndTimeStr "+ scheduleEndTimeStr);
        // convert api time to localtime
        let scheduleStartTime = new Date(scheduleStartTimeStr);
        let scheduleEndTime = new Date(scheduleEndTimeStr);

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
    }

    openDescription(description) {
        dialogs.alert({
            //title: "Error",
            message: description,
            okButtonText: "Ok"
        }).then(function () {
            //console.log("Dialog closed!");
        });
    }


}