import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
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

import app = require("application");
import platform = require("platform");
var frameModule = require("ui/frame");



@Component({
    selector: 'my-app',
    styleUrls: ['pages/calendar/calendar.css'],
    templateUrl: 'pages/calendar/calendar.component.html',
    providers: [CalendarService, ModalDialogService]
})
export class CalendarComponent extends DrawerPage implements OnInit{
    public schedules: Array<Schedule>;
    public birthdays: Array<Birthday>;
    public event_reminders: Array<EventReminder>;
    public holidays: Array<Holiday>;
    public messages: Array<any>;
    public currentDate: Date;
    public teacherName: String;
    public result:Date;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private modal: ModalDialogService, private vcRef: ViewContainerRef,
                private calendarService: CalendarService) {
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
        // Hide 'Default Back button'
        if(this.isIos){
            var controller = frameModule.topmost().ios.controller;
            // get the view controller navigation item
            var navigationItem = controller.visibleViewController.navigationItem;
            // hide back button
            navigationItem.setHidesBackButtonAnimated(true, false);
        }
        // load data
        this.loadCalendarDataByDay(this.currentDate);
    }


    loadCalendarDataByDay(currentDate){
        this.currentDate = currentDate;
        this.isLoading = true;
        this.calendarService.getCalendarData(currentDate)
            .subscribe((result) => {
                    var body = result.body;
                    console.log("Calendar Respone: " + JSON.stringify(body));
                    this.schedules = body.events;
                    //this.messages = body.messages;

                    // TODO load dynaamically once tested and update message property from array to Message class in above declaration
                    this.messages.push(
                        { read_message: true, text: 'Hello world',sender_name: 'Sender name' , child_name: 'child name',child_relationship: 'relationship' },
                        { read_message: false, text: 'Hello world',sender_name: 'Sender name' , child_name: 'child name',child_relationship: 'relationship' },
                        { read_message: true, text: 'Hello world',sender_name: 'Sender name' , child_name: 'child name',child_relationship: 'relationship' }
                        );



                    var reminders = body.reminders;
                    this.birthdays = reminders.birthdays;
                    this.event_reminders = reminders.event_reminders;
                    this.holidays = reminders.holidays;
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    console.log('Error: '+ JSON.stringify(error));
                    alert(JSON.stringify(error))
                }
            );
    }



}