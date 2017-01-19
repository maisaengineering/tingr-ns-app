import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../providers/data/kid_data";
import {SharedData} from "../../providers/data/shared_data";
import {InternetService} from "../../shared/internet.service";
import { MessageService } from "../../shared/message.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./messages.css'],
    templateUrl: './messages.html',
    providers: [ MessageService ]
})
export class MessagesComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public messages: any;
    public showActionBarItems: Boolean = false;
    public sampleTestArray: Array<any>;
    public newMessageText: string = '';

    constructor(private messageService: MessageService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.messages = {};
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
        }, 300);

        console.log("Before  "+ this.messages );

        this.getMessages();
    }

    getMessages(){
        //this.messages = this.messageService.getMessages();
        this.isLoading = true;
        let kid_klid = this.kid.kid_klid;
        this.messageService.getList(kid_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.messages = body.messages;
                    this.isLoading = false;
                    console.log("Messages :" + JSON.stringify(this.messages))
                },
                (error) => {
                    this.isLoading = false;
                    console.log("Error "+ JSON.stringify(error));
                    alert('Internal server error.');
                }
            );
    }

    sendMessage(){
        this.isLoading = true;
        let kid_klid = this.kid.kid_klid;
        this.messageService.sendMessage(this.newMessageText, kid_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    //TODO append the returned data as child view to messages list instead of refreshing
                    this.isLoading = false;
                    // clear newMessageText after message has been sent
                    this.newMessageText = '';
                    this.getMessages();
                },
                (error) => {
                    this.isLoading = false;
                    console.log("Error "+ JSON.stringify(error));
                    //alert('Internal server error.');
                }
            );
        // focus out from field
        let msgTexfield = this.page.getViewById("newMessageText");
        if (msgTexfield.ios) {
            msgTexfield.ios.endEditing(true);
        } else if (msgTexfield.android) {
            msgTexfield.android.clearFocus();
        }

    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }

    isMessagesEmpty(obj) {
        return (Object.keys(obj).length === 0);
    }

}
