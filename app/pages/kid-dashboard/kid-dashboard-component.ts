import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import { Page } from "ui/page";

import {CalendarService,  Message} from "../../shared/calendar.service";

export class DataItem {
    constructor(public itemDesc: string) {}
}

@Component({
    selector: 'my-app',
    styleUrls: ['pages/kid-dashboard/kid-dashboard.css'],
    templateUrl: 'pages/kid-dashboard/kid-dashboard.html',
    providers: [CalendarService]
})
export class KidDashboardComponent implements OnInit{
    public other = {};
    public items: Array<DataItem>;
    public tags: Array<DataItem>;
    public messages: Array<Message>;

    constructor(private calendarService: CalendarService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef) {
        //super(changeDetectorRef);

        const calendar = calendarService.getCalendar();
        this.messages = calendar.messages;

        this.other = {
            name: 'Jannie Deo',
            pictureUrl: 'https://placeholdit.imgix.net/~text?txtsize=9&txt=100%C3%97100&w=100&h=100',
            coverUrl: 'https://placeholdit.imgix.net/~text?txtsize=47&txt=500%C3%97500&w=500&h=500',
        };

        this.items = new Array<DataItem>();
        this.tags = new Array<DataItem>();
        for (let i = 0; i < 5; i++) {
            this.items.push(new DataItem("item " + i));
            this.tags.push(new DataItem("tag " + i))
        }
    }

    ngOnInit() {
        //this.page.actionBarHidden = true;

    }


}