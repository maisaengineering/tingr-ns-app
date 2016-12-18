import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {CalendarService,  Message} from "../../shared/calendar.service";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';



@Component({
    selector: 'my-app',
    styleUrls: ['pages/calendar/calendar.css'],
    templateUrl: 'pages/calendar/calendar.component.html',
    providers: [CalendarService]
})
export class CalendarComponent extends DrawerPage implements OnInit{
    public messages: Array<Message>;


    constructor(private calendarService: CalendarService,private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
        const calendar = calendarService.getCalendar();
        this.messages = calendar.messages;
    }

    ngOnInit() {

    }

    public onItemTap(args) {
        console.log("------------------------ ItemTapped: " + args.index);
    }

    public bubbleClass(message: Message): string {
        const sender =  'me'

        return `bubble-from-${sender}`;
    }
}