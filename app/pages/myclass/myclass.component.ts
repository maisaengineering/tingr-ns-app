import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {MyClassService, ManagedKid, Room} from "../../shared/myclass.service";
import { KidSignInOutService } from "../../shared/kid-signinout.service";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';
import { GridLayout } from "ui/layouts/grid-layout";
// >> long-press-code
import { GestureEventData } from "ui/gestures";
import dialogs = require("ui/dialogs");
import { DatePipe } from '@angular/common';
var nstoasts = require("nativescript-toasts");


@Component({
    selector: 'my-app',
    styleUrls: ['pages/myclass/myclass.css'],
    templateUrl: 'pages/myclass/myclass.component.html',
    providers: [ MyClassService, KidSignInOutService ]
})
export class MyClassComponent extends DrawerPage implements OnInit{
    public managed_kids: Array<ManagedKid>;
    public room: String;

    constructor(private myClassService: MyClassService,
                private kidSignInOutService: KidSignInOutService,
                private changeDetectorRef: ChangeDetectorRef,
                private datePipe: DatePipe) {
        super(changeDetectorRef);

    }

    ngOnInit() {
        this.myClassService.getManagedKids()
            .subscribe(
                (result) => {
                    console.log("MyClass resp: "+JSON.stringify(result));
                    var body = result.body;
                    this.managed_kids = body.managed_kids;
                    this.room = body.session_name
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(JSON.stringify(error))
                }
            );
    }

    onLongPress(event, kid) {
        /*alert("Long Press event raised")
        console.log("LongPress!");
        console.log("Object that triggered the event: " + args.object);
        console.log("View that triggered the event: " + args.view);
        console.log("Event name: " + args.eventName);*/
        //var kidName = kid.fname + ' '+ kid.lname;
        //kidName = "'"+kidName+"'";

        dialogs.action({
            message: "Your message",
            cancelButtonText: "Cancel",
            actions: ["Sign-in/Sign-out","Inform Parent"]
        }).then(result => {
            if(result === 'Sign-in/Sign-out'){
                //var time = this.datePipe.transform(new Date(), 'HH:MM a');
                //alert(kidName + " signed in successfully at " + time)
                this.kidSignInOutService.signInOrSingOut(kid.kid_klid)
                    .subscribe(
                        (result) => {
                            console.log("Sign-in/Sign-out resp: "+JSON.stringify(result));
                            var body = result.body;
                            alert(body.text)
                        },
                        (error) => {
                            console.log('Error in Sing-in/Sign-out: '+ JSON.stringify(error));
                            alert(error._body.message || 'internal server error')
                        }
                    );


            }else if(result === "Inform Parent") {

                dialogs.prompt({
                    title: "Message",
                    message: "Type your message here",
                    okButtonText: "Send",
                    cancelButtonText: "Cancel",
                    //neutralButtonText: "Neutral text",
                    //defaultText: "message",
                    inputType: dialogs.inputType.text
                }).then(r => {
                    console.log("Dialog result: " + r.result + ", text: " + r.text);
                    var options = {
                        text: "Message sent successfully",
                        duration : nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                });
            }
        });

    }
}