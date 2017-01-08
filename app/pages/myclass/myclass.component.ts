import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import { MyClassService, ManagedKid, Room} from "../../shared/myclass.service";
import { KidSignInOutService } from "../../shared/kid-signinout.service";
import { MessageService } from "../../shared/message.service";
import { TeacherInfo } from "../../providers/data/teacher_info";
import { KidData } from "../../providers/data/kid_data";
import { Router, ActivatedRoute } from "@angular/router";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';
import { GridLayout } from "ui/layouts/grid-layout";
// >> long-press-code
import { GestureEventData } from "ui/gestures";
import dialogs = require("ui/dialogs");
import { DatePipe } from '@angular/common';
var nstoasts = require("nativescript-toasts");
import app = require("application");
import platform = require("platform");
var frameModule = require("ui/frame");


@Component({
    selector: 'my-app',
    styleUrls: ['pages/myclass/myclass.css'],
    templateUrl: 'pages/myclass/myclass.component.html',
    providers: [ MyClassService, KidSignInOutService, MessageService ]
})
export class MyClassComponent extends DrawerPage implements OnInit{
    public managed_kids: Array<ManagedKid>;
    public room;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(private myClassService: MyClassService,
                private kidSignInOutService: KidSignInOutService,
                private messageService: MessageService,
                private changeDetectorRef: ChangeDetectorRef,
                private datePipe: DatePipe,
                private kidData: KidData,
                private router: Router) {
        super(changeDetectorRef);
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        this.managed_kids = [];
        this.room =  {};
    }

    ngOnInit() {
        // Hide 'Default Back button'
        if(this.isIos){
            var controller = frameModule.topmost().ios.controller;
            // get the view controller navigation item
            var navigationItem = controller.visibleViewController.navigationItem;
            // hide back button
            navigationItem.setHidesBackButtonAnimated(true, false);
        }
        this.room =  TeacherInfo.parsedDetails.rooms[0];
        this.loadManagedKids(this.room);
    }

    loadManagedKids(room){
        this.isLoading = true;
        this.myClassService.getManagedKids(room)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.managed_kids = body.managed_kids;
                    this.isLoading = false;
                    console.log("Managed Kids :" + JSON.stringify(body.managed_kids))
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }

    openRooms(){
        //TODO get latest rooms by calling API
        let rooms = TeacherInfo.parsedDetails.rooms;
        console.log("Rooms "+ JSON.stringify(rooms));
        let actions =[];
        for (let room of rooms) {
            actions.push(room.session_name);
        }
        dialogs.action({
            message: "Select Room",
            cancelButtonText: "Cancel",
            actions: actions
        }).then(result => {
           this.room = rooms.filter(report => report.session_name === result)[0];
           this.loadManagedKids(this.room);

        });
    }

    redirectToKidDashboard(kid){
        this.kidData.info =  kid;
        this.router.navigate(["kid-dashboard"]);
    }

    onLongPress(event, kid) {
        dialogs.action({
            //message: "Your message",
            cancelButtonText: "Cancel",
            actions: ["Sign-in/Sign-out","Message a Parent"]
        }).then(result => {
            if(result === 'Sign-in/Sign-out'){
                this.signInOrSignOutKid(kid);
            }else if(result === "Message a Parent") {
                dialogs.prompt({
                    title: "Message",
                    //message: "Type your message here",
                    okButtonText: "Send",
                    cancelButtonText: "Cancel",
                    //neutralButtonText: "Neutral text",
                    defaultText: "Type your message here",
                    inputType: dialogs.inputType.text
                }).then(r => {
                    if(r.result === true ){
                        this.sendMessageForKid(r.text, kid);
                    } 
                });
            }
        });

    }

    signInOrSignOutKid(kid){
        //var time = this.datePipe.transform(new Date(), 'HH:MM a');
        //alert(kidName + " signed in successfully at " + time)
        this.isLoading = true;
        this.kidSignInOutService.signInOrSingOut(kid.kid_klid)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    let body = result.body;
                    let options = {
                        text: body.text,
                        duration : nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );

    }

    sendMessageForKid(text, kid){
        this.isLoading = true;
        this.messageService.sendMessage(text, kid.kid_klid)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    //var body = result;
                    let options = {
                        text: result.message,
                        duration : nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }
}