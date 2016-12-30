import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import { Page } from "ui/page";

import { ManagedKid } from "../../shared/myclass.service";
import { PostService,  Post, TaggedTo, Comment} from "../../shared/post.service";

import frameModule = require("ui/frame");
import { Router, NavigationExtras } from "@angular/router";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { KidData } from "../../providers/data/kid_data";


export class DataItem {
    constructor(public itemDesc: string) {}
}

@Component({
    selector: 'my-app',
    styleUrls: ['pages/kid-dashboard/kid-dashboard.css'],
    templateUrl: 'pages/kid-dashboard/kid-dashboard.html',
    providers: [ PostService ]
})
export class KidDashboardComponent implements OnInit{
    public kid: ManagedKid;
    public posts: Array<Post>;
    public comments: Array<Comment>;
    public tagged_to: Array<TaggedTo>;
    public topmost;

    constructor(private postService: PostService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private nav: RouterExtensions,
                private kidData: KidData) {
        //super(changeDetectorRef);

        this.kid = kidData.info;

        console.log("#####   "+ JSON.stringify(this.kid))

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