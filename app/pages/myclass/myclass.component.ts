import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import { MyClassService, ManagedKid, Room} from "../../shared/myclass.service";
import { KidSignInOutService } from "../../shared/kid-signinout.service";
import { MessageService } from "../../shared/message.service";
import { TeacherService } from "../../shared/teacher/teacher.service";
import { TeacherInfo } from "../../providers/data/teacher_info";
import { KidData } from "../../providers/data/kid_data";
import { Router, ActivatedRoute } from "@angular/router";
import {Page} from "ui/page";

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
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');


@Component({
    selector: 'my-app',
    styleUrls: ['pages/myclass/myclass.css'],
    templateUrl: 'pages/myclass/myclass.component.html',
    providers: [ MyClassService, KidSignInOutService, MessageService, TeacherService ]
})
export class MyClassComponent extends DrawerPage implements OnInit{
    public managed_kids: Array<ManagedKid>;
    public room;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public assignedRooms: Array<any>;

    constructor(private myClassService: MyClassService,
                private kidSignInOutService: KidSignInOutService,
                private teacherService: TeacherService,
                private messageService: MessageService,
                private changeDetectorRef: ChangeDetectorRef,
                private datePipe: DatePipe,
                private kidData: KidData,
                private router: Router,
                private page: Page) {
        super(changeDetectorRef);
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        this.managed_kids = [];
        this.room =  {};
        // initialize with when user logged in data and then invoke assignedrooms api to get updated ones
        this.assignedRooms = TeacherInfo.parsedDetails.rooms;
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
        this.room =  this.assignedRooms[0];
        this.loadManagedKids(this.room);
        this.getAssignedRooms();
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

    getAssignedRooms(){
        this.teacherService.getAssignedRooms()
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.assignedRooms = body.rooms;
                },
                (error) => {
                }
            );
    }

    openRooms(){
        let rooms = this.assignedRooms;
        console.log("Rooms "+ JSON.stringify(this.assignedRooms))
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

        let inoutTimeLabel = view.getViewById(this.page, "in-or-out-time-"+kid.kid_klid);
        this.isLoading = true;
        this.kidSignInOutService.signInOrSingOut(kid.kid_klid)
            .subscribe(
                (result) => {
                    console.log("REsult  "+ JSON.stringify(result));
                    this.isLoading = false;
                    let body = result.body;
                    let options = {
                        text: body.text,
                        duration : nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                    if(body.in_or_out_time){
                        inoutTimeLabel.body.in_or_out_time; // update label with result
                        inoutTimeLabel.parent.visibility= 'visible'; // show parent
                        inoutTimeLabel.shake(); //shake effect
                    }
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