import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit, AfterViewInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {CalendarService,Schedule, Birthday,EventReminder, Holiday,  Message} from "../../shared/calendar.service";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';

import { TeacherInfo } from "../../providers/data/teacher_info";
import * as dialogs from "ui/dialogs";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { ModalDatePicker } from "../../pages/dialogs/modal-date-picker";
import { DatePicker } from "ui/date-picker";
import {Page} from "ui/page";

@Component({
    selector: 'my-app',
    styleUrls: ['pages/calendar/calendar.css'],
    templateUrl: 'pages/calendar/calendar.component.html',
    providers: [CalendarService, ModalDialogService]
})
export class CalendarComponent extends DrawerPage implements OnInit, AfterViewInit{
    public schedules: Array<Schedule>;
    public birthdays: Array<Birthday>;
    public event_reminders: Array<EventReminder>;
    public holidays: Array<Holiday>;
    public messages: Array<Message>;
    public currentDate: Date;
    public teacherName: String;
    public result:Date;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private modal: ModalDialogService, private vcRef: ViewContainerRef,
                private calendarService: CalendarService) {
        super(changeDetectorRef);
        this.currentDate = new Date();
        this.schedules = [];
        this.birthdays = [];
        this.event_reminders = [];
        this.holidays = [];
        this.messages = [];
        var teacherDetails = TeacherInfo.parsedDetails;
        this.teacherName = teacherDetails.fname +' '+ teacherDetails.lname;
    }

    static entries = [
        ModalDatePicker
    ];

    static exports = [
        ModalDatePicker
    ];


    createModalDatePickerView() {
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

                console.log("date result in calendar component "+dateresult);


                /*console.log("date result in cal component "+dateresult);
                that.result = dateresult;*/

               // var yesterday = new Date();
               // yesterday.setDate(yesterday.getDate() - 1);

               // this.currentDate = yesterday;
                this.loadCalendarDataByDay(dateresult);

            })
    }

    ngOnInit() {
        this.loadCalendarDataByDay(this.currentDate);
    }


    loadCalendarDataByDay(currentDate){
        this.currentDate = currentDate;
        this.calendarService.getCalendarData(currentDate)
            .subscribe((result) => {
                    var body = result.body;
                    console.log("Calendar Respone: " + JSON.stringify(body));
                    this.schedules = body.events;
                    this.messages = body.messages;
                    var reminders = body.reminders;
                    this.birthdays = reminders.birthdays;
                    this.event_reminders = reminders.event_reminders;
                    this.holidays = reminders.holidays;
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(JSON.stringify(error))
                }
            );
    }

    ngAfterViewInit() {
    }


}