import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {MyClassService, ManagedKid, Room} from "../../shared/myclass.service";
import {KidSignInOutService} from "../../shared/kid-signinout.service";
import {MessageService} from "../../shared/message.service";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {KidData} from "../../providers/data/kid_data";
import {SharedData} from "../../providers/data/shared_data";
import {RouterExtensions} from "nativescript-angular/router";
import {Page} from "ui/page";
import {TeacherInfo} from "../../providers/data/teacher_info";
import {Observable} from "rxjs/Rx";
import {ServerErrorService} from "../../shared/server.error.service";
// >> long-press-code
import {GestureEventData} from "ui/gestures";
import dialogs = require("ui/dialogs");
import {DatePipe} from '@angular/common';
import {InternetService} from "../../shared/internet.service";
var nstoasts = require("nativescript-toasts");
var app = require("application");
var platform = require("platform");
var frameModule = require("ui/frame");
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');


@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./myclass.css'],
    templateUrl: './myclass.component.html',
    providers: [MyClassService, KidSignInOutService,
        MessageService, TeacherService, ServerErrorService]
})
export class MyClassComponent extends DrawerPage implements OnInit {
    public managed_kids: Array<ManagedKid>;
    public roomName: String;
    public currentRoom;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public assignedRooms: Array<any>;
    public showActionBarItems: Boolean = false;

    /*
     * Gesture examples
     *
     onTap(args: GestureEventData) {
     console.log("Tap!")
     }
     onDoubleTap(args: GestureEventData) {
     console.log("DoubleTap!")

     }
     onLongPress(args: GestureEventData) {
     console.log("LongPress!")
     }
     * */


    constructor(private myClassService: MyClassService,
                private kidSignInOutService: KidSignInOutService,
                private teacherService: TeacherService,
                private messageService: MessageService,
                private changeDetectorRef: ChangeDetectorRef,
                private datePipe: DatePipe,
                private kidData: KidData,
                private sharedData: SharedData,
                private routerExtensions: RouterExtensions,
                private page: Page,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        super(changeDetectorRef);
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        this.managed_kids = [];
        this.currentRoom = TeacherInfo.parsedCurrentRoom;
        this.roomName = this.currentRoom.session_name;
        // initialize with when user logged in data and then invoke assignedrooms api to get updated ones
        //this.assignedRooms = TeacherInfo.parsedDetails.rooms;
        this.assignedRooms = [];
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();

        // show actionBarItems after some time to fix overlappingg issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);

        this.getRoomsAndMangedKids();
    }


    getRoomsAndMangedKids() {
        this.isLoading = true;
        this.myClassService.getRoomsAndMangedKids(this.currentRoom).subscribe(
            (result) => {
                this.assignedRooms = result[0].body.rooms;
                // Set Teacher CurrentRoom and this.currentRoom as first one as default
                TeacherInfo.currentRoom = JSON.stringify(this.assignedRooms[0]);
                //this.currentRoom = this.assignedRooms[0];
                //this.roomName = this.currentRoom.session_name;
                this.managed_kids = result[1].body.managed_kids;
                // save managed kids in SharedData Provider, so data will be available to all components
                this.sharedData.managedKids = this.managed_kids;
                this.isLoading = false;
            },
            (error) => {
                this.isLoading = false;
                this.serverErrorService.showErrorModal();
            }
        );
    }

    loadManagedKids(room) {
        this.isLoading = true;
        this.myClassService.getManagedKids(room)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.managed_kids = body.managed_kids;
                    this.isLoading = false;
                    // save managed kids in SharedData Provider, so data will be available to all components
                    this.sharedData.managedKids = this.managed_kids;

                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }


    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.myClassService.getManagedKids(this.currentRoom)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.managed_kids = body.managed_kids;
                    // save managed kids in SharedData Provider, so data will be available to all components
                    this.sharedData.managedKids = this.managed_kids;
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    this.isLoading = false;
                    pullRefresh.refreshing = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }


    openRooms() {
        let rooms = this.assignedRooms;
        let actions = [];
        for (let room of rooms) {
            actions.push(room.session_name);
        }
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: actions
        }).then(result => {
            //console.log("Result --- "+ result)
            // don't fetch data if clicks on same room
            if (this.roomName != result) {
                this.currentRoom = rooms.filter(report => report.session_name === result)[0];
                // save the selected room in application data to access application wide
                TeacherInfo.currentRoom = JSON.stringify(this.currentRoom);
                this.roomName = this.currentRoom.session_name;
                this.loadManagedKids(this.currentRoom);
            }
        });
    }

    redirectToKidDashboard(kid) {
        this.kidData.info = kid;

        this.routerExtensions.navigate(["/kid-dashboard"], {
            transition: {
                name: "slideLeft"
            }
        });
    }

    onLongPressKid(event, kid) {
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Sign-in/Sign-out", "Message a Parent"]
        }).then(result => {
            if (result === 'Sign-in/Sign-out') {
                this.signInOrSignOutKid(kid);
            } else if (result === "Message a Parent") {
                dialogs.prompt({
                    title: "Message",
                    //message: "Type your message here",
                    okButtonText: "Send",
                    cancelButtonText: "Cancel",
                    //neutralButtonText: "Neutral text",
                    //defaultText: "Type your message here",
                    inputType: dialogs.inputType.text
                }).then(r => {
                    if (r.text === '') {
                        return;
                    }
                    if (r.result === true) {
                        this.sendMessageForKid(r.text, kid);
                    }
                });
            }
        });

    }

    signInOrSignOutKid(kid) {
        //var time = this.datePipe.transform(new Date(), 'HH:MM a');
        //alert(kidName + " signed in successfully at " + time)

        let inoutTimeLabel = view.getViewById(this.page, "in-or-out-time-" + kid.kid_klid);
        this.isLoading = true;
        this.kidSignInOutService.signInOrSingOut(kid.kid_klid)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    let body = result.body;
                    let options = {
                        text: body.text,
                        duration: nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                    if (body.in_or_out_time) {
                        inoutTimeLabel.text = body.in_or_out_time; // update label with result
                        inoutTimeLabel.parent.visibility = 'visible'; // show parent
                        try {
                            inoutTimeLabel.shake(); //shake effect
                        } catch (err) {
                            // may be page redirected kid-dashboard
                        }

                    }
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );

    }

    sendMessageForKid(text, kid) {
        this.isLoading = true;
        this.messageService.sendMessage(text, kid.kid_klid)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    //var body = result;
                    let options = {
                        text: result.message,
                        duration: nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }
}