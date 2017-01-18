import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import { ReminderService } from "../../../shared/reminder.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./reminders.css'],
    templateUrl: './reminders.html',
    providers: [ ReminderService ]
})
export class KidRemindersComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public reminders: Array<any>;
    public showActionBarItems: Boolean = false;

    constructor(private reminderService: ReminderService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.reminders = [];
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
        // show actionBarItems after some time to fix overlappingg issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);

        this.getList();

    }

    getList(){
        this.reminders = this.reminderService.getList();

        console.log("DATTATTAT " + JSON.stringify(this.reminders))
    }

    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.reminders = this.reminderService.getList();
        setTimeout(function () {
            pullRefresh.refreshing = false;
        }, 1000);
    }

    openReminder(reminder) {
        let reminderNameLabel = view.getViewById(this.page, "reminder-name-" + reminder.kl_id);
        let reminderItemView = view.getViewById(this.page, "reminder-" + reminder.kl_id);
        dialogs.alert({
            //title: "Error",
            message: reminder.name,
            okButtonText: "Ok"
        }).then(function () {
            if(reminder.seen){
                console.log('already seen');
            }else{
                reminderNameLabel.className = 'text-muted';
                reminderItemView.shake();
            }
        });
    }


    goBack(){
        this.routerExtensions.backToPreviousPage();
    }

}