import {
    Component,
    ViewContainerRef,
    ChangeDetectionStrategy,
    OnChanges,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    OnInit,
    SimpleChange
} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../providers/data/kid_data";
import {SharedData} from "../../providers/data/shared_data";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import {MessageService} from "../../shared/message.service";
import {TeacherInfo} from "../../providers/data/teacher_info";

import {ScrollView} from "ui/scroll-view";

var view = require("ui/core/view"); 
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");
import {NgFor} from '@angular/common';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./messages.css'],
    templateUrl: './messages.html',
    providers: [MessageService, ServerErrorService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit, OnChanges {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public messages: any;
    public msgs: any;
    public showActionBarItems: Boolean = false;
    public loadingPreviousMsgs: Boolean = false;
    public newMessageText: string = '';
    public conversationKlId: string = '';
    public lastMessageTime: string = '';
    @ViewChild("messagesScroll") messagesScrollRef: ElementRef;


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
        this.msgs = {};
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
        this.getMessages();
        //  this.changeDetectorRef.detectChanges();

        // TODO work on page scroll swipe up to load previous messages
        /* let messagesScrollerView = <ScrollView>this.messagesScrollRef.nativeElement;
         messagesScrollerView.on("swipe", (args)=> {
         console.log("-----------------Swipe Direction: " + args.direction);
         console.log("messagesScrollerView.verticalOffset "+ messagesScrollerView.verticalOffset);
         console.log("messagesScrollerView.verticalOffset "+ messagesScrollerView.verticalOffset);
         //if scrolling down (swipe up) --  args.direction === 4
         //if scrolling up (swipe down) -- args.direction === 8

         })*/
    }

    getMessages() {
        let kid_klid = this.conversationKlId ? '' : this.kid.kid_klid;
        this.isLoading = true;
        this.getNewMessages(kid_klid, true, false);
    }

    refreshList(args) {
        let pullRefresh = args.object;
        let kid_klid = this.conversationKlId ? '' : this.kid.kid_klid;
        this.getNewMessages(kid_klid, false, pullRefresh);
    }


    getNewMessages(kid_klid, scrollToBottom = false, pullRefresh) {
        setTimeout(() => {
            this.messageService.getList(kid_klid, this.conversationKlId, this.lastMessageTime)
                .subscribe(
                    (result) => {
                        let body = result.body;
                        let messages = body.messages;
                        if(!this.isMessagesEmpty(body.messages)) {
                            this.lastMessageTime = body.last_message_time;
                            if (!this.isMessagesEmpty(messages)) {
                                for (var key in messages) {
                                    if (messages.hasOwnProperty(key)) {
                                        // alert("Key is " + key + ", value is" + newMessages[key]);
                                        // if date already exists
                                        if (this.msgs[key]) {
                                            messages[key].forEach((msg) => {
                                                this.msgs[key].unshift(msg)
                                            })
                                        } else {
                                            // date doesn't exists so add it newly to oldMessages
                                            this.msgs[key] = messages[key];
                                        }
                                    }
                                }
                            }
                        }
                        this.makeMessagesRead(body.conversation_id,messages);
                        this.isLoading = false;
                        if (pullRefresh) {
                            pullRefresh.refreshing = false;
                        }
                        if (scrollToBottom) {
                            this.scrollToBottom();
                        }
                        this.changeDetectorRef.markForCheck();
                    },
                    (error) => {
                        this.isLoading = false;
                        this.serverErrorService.showErrorModal();
                    }
                );
        }, 1000)
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        /*  if (changes['newMessageText']) { // fire your event }
         console.log('------- CHnaged')
         } else {
         console.log('--------- not changes')
         }*/
    }


    makeMessagesRead(conversationKlId, messages) {
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
        if (unreadMessageIds.length) {
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
        // focus out from field
        let msgTexfield = view.getViewById(this.page, "newMessageText");
        let msgText = msgTexfield.text.trim();
        // this.isLoading = true;
        if (msgText == '') {
            return;
        }
        msgTexfield.dismissSoftInput();
        let kid_klid = this.conversationKlId ? '' : this.kid.kid_klid;
        let teacherInfo = TeacherInfo.parsedDetails;
        // let createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        //console.log("createdAt "+ createdAt);
        let newMsg = {
            kl_id: "",
            text: msgText,
            sender_name: teacherInfo.fname + ' ' + teacherInfo.lname,
            sender_klid: teacherInfo.teacher_klid,
            photograph: teacherInfo.photograph,
            child_name: "", child_relationship: "",
            conversation_klid: this.conversationKlId,
            created_at: new Date(), read_message: true
        };

        let isFirstMessage = this.isMessagesEmpty(this.msgs);
        if (isFirstMessage) {
            this.isLoading = true;
        } else {
            let currentDate = moment(new Date()).format('MM/DD/YYYY');
            // if date already exists
            if (this.msgs[currentDate]) {
                this.msgs[currentDate].push(newMsg);
            } else {
                this.msgs[currentDate] = [newMsg];// date doesn't exists so add it newly
            }
        }

        this.scrollToBottom();
        // send message to server in background
        this.messageService.sendMessage(msgText, kid_klid, this.conversationKlId)
            .subscribe(
                (result) => {
                    let body = result.body;
                    if (isFirstMessage) {
                        this.getNewMessages(kid_klid, false, false)
                    }
                },
                (error) => {
                    //console.log("Error " + JSON.stringify(error));
                    this.serverErrorService.showErrorModal();
                }
            );
        msgTexfield.text = '';

    }

    goBack() {
        if(this.conversationKlId){
            this.routerExtensions.navigate(["/calendar"], {
                transition: {
                    name: "slideRight"
                }
            })
        }else{
            this.routerExtensions.backToPreviousPage();
        }

    }

    isMessagesEmpty(obj) {
        //return (Object.keys(obj).length === 0);
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    scrollToBottom() {
        // https://gitnet.fr/deblan/nativescript-docs/src/v1.0.0/ApiReference/ui/scroll-view/ScrollView.md
        // scroll to bottom of the message using ScrollView ---
        setTimeout(() => {
            let messagesScrollerView = <ScrollView>this.messagesScrollRef.nativeElement;
            let offset = messagesScrollerView.scrollableHeight; // get the current scroll height
            messagesScrollerView.scrollToVerticalOffset(offset, true); // scroll to the bottom with animation
        }, 700);
    }

}
