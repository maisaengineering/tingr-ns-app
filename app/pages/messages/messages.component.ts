import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras, ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../providers/data/kid_data";
import {SharedData} from "../../providers/data/shared_data";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import {MessageService} from "../../shared/message.service";
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
    providers: [MessageService, ServerErrorService]
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
    public conversationKlId: string = '';

    constructor(private messageService: MessageService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private route: ActivatedRoute,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        //super(changeDetectorRef);
        this.messages = {};
        this.kid = {};
        this.kid = this.kidData.info;

        // get the conversationId from navigation params if this page is open from schedule
        this.route.queryParams.subscribe(params => {
            this.conversationKlId = params["conversationKlId"];
        });

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

        this.getMessages();
    }

    getMessages() {
        //this.messages = this.messageService.getMessages();
        this.isLoading = true;
        // if navigation comes from schedule then its a conversation
        let kid_klid = this.conversationKlId ? '' : this.kid.kid_klid;
        this.messageService.getList(kid_klid, this.conversationKlId)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.messages = body.messages;
                    this.isLoading = false;
                    // If conversation opens from Schedule page
                    // make unread messages as read by calling in background
                    if(this.conversationKlId){
                        this.makeMessagesRead(this.conversationKlId,this.messages);
                    }
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    makeMessagesRead(conversationKlId,messages) {
        //To get the unread messages and make them as read
        let unreadMessageIds = [];
        let unreadMessages = [];
        let groupedMessages = messages;
        for (let groupedMessage in groupedMessages) {
            if (groupedMessages.hasOwnProperty(groupedMessage)) {
                //console.log("Key is " + groupedMessage + ", value is" + JSON.stringify(groupedMessages[groupedMessage]));
                unreadMessages = groupedMessages[groupedMessage].filter(msg => msg.read_message === false);
                //console.log("Unread Messages " + JSON.stringify(unreadMessages));
                unreadMessages.forEach((message) => {
                    unreadMessageIds.push(message.kl_id)
                })
            }
        }
        // invoke API
        if(unreadMessageIds.length){
            this.messageService.makeMessagesRead(conversationKlId, unreadMessageIds)
                .subscribe(
                    (result) => {
                        //console.log("RESULT UNREAD "+ JSON.stringify(result));
                    },
                    (error) => {
                       // console.error(error.stack)
                    }
                );
        }

    }

    sendMessage() {
        this.isLoading = true;
        let kid_klid = this.conversationKlId ? '' : this.kid.kid_klid;
        this.messageService.sendMessage(this.newMessageText, kid_klid, this.conversationKlId)
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
                    this.serverErrorService.showErrorModal();
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

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    isMessagesEmpty(obj) {
        return (Object.keys(obj).length === 0);
    }

}
