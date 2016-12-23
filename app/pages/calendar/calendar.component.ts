import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit, AfterViewInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {CalendarService,Schedule, Birthday,EventReminder, Holiday,  Message} from "../../shared/calendar.service";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';

import { TeacherInfo } from "../../providers/data/teacher_info";
import {LoadingIndicator} from "nativescript-loading-indicator";

@Component({
    selector: 'my-app',
    styleUrls: ['pages/calendar/calendar.css'],
    templateUrl: 'pages/calendar/calendar.component.html',
    providers: [CalendarService]
})
export class CalendarComponent extends DrawerPage implements OnInit, AfterViewInit{
    public schedules: Array<Schedule>;
    public birthdays: Array<Birthday>;
    public event_reminders: Array<EventReminder>;
    public holidays: Array<Holiday>;
    public messages: Array<Message>;
    public currentDate: Date;
    public teacherName: String;
    public loader;

    constructor(private calendarService: CalendarService,private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
        this.currentDate = new Date();
        this.schedules = [];
        this.birthdays = [];
        this.event_reminders = [];
        this.holidays = [];
        this.messages = [];
        var teacherDetails = TeacherInfo.parsedDetails;
        this.teacherName = teacherDetails.fname +' '+ teacherDetails.lname;
        this.loader = new LoadingIndicator();
    }

    ngOnInit() {
        this.loader.show();
        this.calendarService.getCalendarData(this.currentDate)
            .subscribe((result) => {
                    var body = result.body;
                    console.log("Calendar Respone: " + JSON.stringify(body));
                    this.schedules = body.events;
                    this.messages = body.messages;
                    var reminders = body.reminders;
                    this.birthdays = reminders.birthdays;
                    this.event_reminders = reminders.event_reminders;
                    this.holidays = reminders.holidays;
                    this.loader.hide();
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(JSON.stringify(error))
                }
            );
    }

    ngAfterViewInit() {
    }

    public onItemTap(args) {
        console.log("------------------------ ItemTapped: " + args.index);
    }

    public bubbleClass(schedule: Schedule): string {
        const sender =  'me';

        return `bubble-from-${sender}`;
    }
}