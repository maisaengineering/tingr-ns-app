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
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ModalPostComment} from "../../pages/dialogs/modal-post-comment";
import {ServerErrorService} from "../../shared/server.error.service";
// >> long-press-code
import {GestureEventData} from "ui/gestures";
import dialogs = require("ui/dialogs");
import {DatePipe} from '@angular/common';
import {InternetService} from "../../shared/internet.service";
import {ModalMessageToParent} from "../dialogs/modal-message-to-parent";
let nstoasts = require("nativescript-toasts");
let app = require("application");
let platform = require("platform");
let frameModule = require("ui/frame");
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');
let gestures = require("ui/gestures");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./myclass.css'],
    templateUrl: './myclass.component.html',
    providers: [MyClassService, KidSignInOutService,
        MessageService, TeacherService, ModalDialogService, ServerErrorService]
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
                private modal: ModalDialogService,
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
            if (result !== 'Cancel') {
                // don't fetch data if clicks on same room
                if (this.roomName != result) {
                    this.currentRoom = rooms.filter(report => report.session_name === result)[0];
                    // save the selected room in application data to access application wide
                    TeacherInfo.currentRoom = JSON.stringify(this.currentRoom);
                    this.roomName = this.currentRoom.session_name;
                    this.loadManagedKids(this.currentRoom);
                }
            }


        });
    }

    kidLoaded(args) {
        let kidStackLayout = args.object;
        kidStackLayout.observe(gestures.GestureTypes.tap | gestures.GestureTypes.longPress, (args) => {
            //console.log("Event: " + args.eventName + ", sender: " + args.object);
            let kid = args.object.get("kid");
            if (args.eventName === 'tap') {
                // this.onTapKid(kid); // this wonn't work it invoking defulat tap in view
            } else if (args.eventName === 'longPress') {
                console.log("Event  longPress");
                this.onLongPressKid(kid);
            }
        });

    }

    onTapKid(kid) {
        this.kidData.info = kid;
        let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);
        // below one is usefull when removing element from stack
        /* kidStackLayout.animate(
         {backgroundColor: '#EAF2FA', duration: 2000, opacity: 0.25}
         );*/
        kidStackLayout.animate(
            { backgroundColor: '#EAF2FA'}
        ).then(() => {
            this.routerExtensions.navigate(["/kid-dashboard"], {
                transition: {
                    name: "slideLeft"
                }
            });
        }).catch(()=>{
            // animation error
        });
    }


    onLongPressKid(kid) {
        let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);

        kidStackLayout.animate(
            { backgroundColor: '#EAF2FA'}
        ).then(() => {
            dialogs.action({
                //message: "",
                cancelButtonText: "Cancel",
                actions: ["Sign-in/Sign-out", "Message a Parent"]
            }).then(result => {
                if(result == 'Cancel' || typeof result == "undefined"){
                    this.cancelKidSelectionAnimation(kid);
                } else  {
                    if (result === 'Sign-in/Sign-out') {
                        this.signInOrSignOutKid(kid);
                    } else if (result === "Message a Parent") {
                        this.showModalMessageToParent(kid);
                    }
                }
            });
        }).catch(()=>{
            // animation error
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
                    this.cancelKidSelectionAnimation(kid);
                },
                (error) => {
                    this.cancelKidSelectionAnimation(kid);
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );

    }

    showModalMessageToParent(kid) {
        var options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                kid_kl_id: kid.kid_klid
            },
            fullscreen: false
        };
        this.modal.showModal(ModalMessageToParent, options).then((result) => {
            console.log("Result "+ result);
            if (result === 'close' || typeof(result) == "undefined") {
                // modal closed
                // console.log('Modal closed');
                this.cancelKidSelectionAnimation(kid);
            } else {
                //TODO add comment details as childView to parent instead refresh
                //console.log("Modal Comment Result " + JSON.stringify(result));/
                let options = {
                    text: result.message,
                    duration: nstoasts.DURATION.SHORT
                };
                nstoasts.show(options);
                this.cancelKidSelectionAnimation(kid);
            }

        })
    }

    // clears the selected animation for kid
    cancelKidSelectionAnimation(kid){
        let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);
        kidStackLayout.animate(
            {backgroundColor: 'white', duration: 2000}
        ).then(()=>{
            // animationDone
        }).catch(()=>{
            // animation error
        })
    }

}