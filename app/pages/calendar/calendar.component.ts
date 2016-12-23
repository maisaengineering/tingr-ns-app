import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {CalendarService,Schedule,Reminder,  Message} from "../../shared/calendar.service";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';



@Component({
    selector: 'my-app',
    styleUrls: ['pages/calendar/calendar.css'],
    templateUrl: 'pages/calendar/calendar.component.html',
    providers: [CalendarService]
})
export class CalendarComponent extends DrawerPage implements OnInit{
    public schedules: Array<Schedule>;
    public reminders: Array<Reminder>;
    public messages: Array<Message>;
    public currentDate: Date;


    constructor(private calendarService: CalendarService,private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
        this.currentDate = new Date()
    }

    ngOnInit() {
        this.calendarService.getCalendarData(this.currentDate)
            .subscribe(
                (result) => {
                     var body = result.body;
                     this.schedules = body.events;
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(JSON.stringify(error))
                }
            );
    }

    public onItemTap(args) {
        console.log("------------------------ ItemTapped: " + args.index);
    }

    public bubbleClass(schedule: Schedule): string {
        const sender =  'me';

        return `bubble-from-${sender}`;
    }
}