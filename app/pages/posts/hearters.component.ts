import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../providers/data/kid_data";
import {SharedData} from "../../providers/data/shared_data";
import {InternetService} from "../../shared/internet.service";
import { PostService } from "../../shared/post.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./hearters.css'],
    templateUrl: './hearters.html',
    providers: [ PostService]
})
export class HeartersComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public showActionBarItems: Boolean = false;
    public hearters: Array<any>;

    constructor(private postService: PostService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.hearters = [];
        this.kid = {};
        this.kid = this.kidData.info;

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        // Hide 'Default Back button'
        if(this.isIos){
            var controller = frameModule.topmost().ios.controller;
            // get the view controller navigation item
            var navigationItem = controller.visibleViewController.navigationItem;
            // hide back button
            navigationItem.setHidesBackButtonAnimated(true, false);
        }
        // show actionBarItems after some time to fix overlapping issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 300);
        this.getList()
    };

    getList(){
        this.isLoading = true;
        let postKlId = this.sharedData.postKlId;
        this.postService.getHearters(postKlId)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.hearters = body.hearters;
                    this.isLoading = false;
                    console.log("Hearters :" + JSON.stringify(this.hearters));
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }

    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        let postKlId = this.sharedData.postKlId;
        this.postService.getHearters(postKlId)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.hearters = body.hearters;
                    setTimeout(function () {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    alert('Internal server error.');
                }
            );

    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }

}