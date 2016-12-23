import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import { Page } from "ui/page";

import {CalendarService,  Message} from "../../shared/calendar.service";

import frameModule = require("ui/frame");
import { Router, NavigationExtras } from "@angular/router";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";



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
    public moment = {};
    public items: Array<DataItem>;
    public tags: Array<DataItem>;
    public messages: Array<any>;
    public topmost;

    constructor(private calendarService: CalendarService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private nav: RouterExtensions) {
        //super(changeDetectorRef);

       /* this.topmost = frameModule.topmost();
        const calendar = calendarService.getCalendar();
        this.messages = calendar.messages;*/
        this.messages = [];

        this.other = {
            name: 'Jannie Deo',
            pictureUrl: 'https://placeimg.com/100/100/people',
            coverUrl: 'https://placeholdit.imgix.net/~text?txtsize=47&txt=500%C3%97500&w=500&h=500',
        };

        this.moment = {
            cover_image: 'https://placeimg.com/500/500/nature',
            org_logo: 'https://placeimg.com/75/75/tech',
            tagged_img: 'https://placeimg.com/50/50/people'
        }

        this.items = new Array<DataItem>();
        this.tags = new Array<DataItem>();
        for (let i = 0; i < 5; i++) {
            this.items.push(new DataItem("item " + i));
            this.tags.push(new DataItem("tag " + i))
        }


        this.messages.push(
            {photograph: 'http://placeimg.com/75/75/people',kid_name: 'John Reo', relation: "Jonie's father", text: "Jonie has bit cold.Please call us if it get worst!", read: true},
            {photograph: 'https://placeimg.com/75/75/people',kid_name: 'Jane Deo', relation: "Johnny's mather", text: "We would like to pickup him up around 5pm today", read: false},
            {photograph: 'https://placeimg.com/75/75/people',kid_name: 'Jane Deo', relation: "Johnny's mather", text: "I am on-my way", read: true}
        );



    }

    ngOnInit() {
        //this.page.actionBarHidden = true;

    }

    goBack(){
        //this.nav.backToPreviousPage();
        this.router.navigate(['/myclass']);
       //  this.topmost.goBack();
        //Perhaps the simplest way to navigate is by specifying the file name of the page to which you want to navigate.
        //this.topmost.navigate("myclass");

    }


}