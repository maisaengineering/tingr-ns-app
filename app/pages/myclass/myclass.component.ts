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
import {ListViewEventData, RadListView} from "nativescript-telerik-ui/listview";
import * as timerModule  from "timer";
import listViewModule = require("nativescript-telerik-ui/listview/angular");
import listViewAnularModule = require("nativescript-telerik-ui/listview/angular");
import {ObservableArray} from "data/observable-array";

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./myclass.css'],
    templateUrl: './myclass.component.html',
    providers: [MyClassService, KidSignInOutService,
        MessageService, TeacherService, ModalDialogService, ServerErrorService]
})
export class MyClassComponent extends DrawerPage implements OnInit {
    private managed_kids: ObservableArray<ManagedKid>;
    public roomName: String;
    public currentRoom;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public assignedRooms: Array<any>;
    public showActionBarItems: Boolean = false;
    private numberOfAddedItems; // pull to refresh
    private isLongPressed;
    Boolean = false;

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
        this.changeDetectorRef.detectChanges();
    }


    getRoomsAndMangedKids() {
        this.isLoading = true;
        this.myClassService.getRoomsAndMangedKids(this.currentRoom).subscribe(
            (result) => {
                this.managed_kids = new ObservableArray<ManagedKid>();
                this.assignedRooms = result[0].body.rooms;
                // Set Teacher CurrentRoom and this.currentRoom as first one as default
                //TeacherInfo.currentRoom = JSON.stringify(this.assignedRooms[0]);
                //this.currentRoom = this.assignedRooms[0];
                //this.roomName = this.currentRoom.session_name;
                result[1].body.managed_kids.forEach((managedKid) => {
                   this.addNewManagedKid(managedKid);
                });
                // save managed kids in SharedData Provider, so data will be available to all components
                this.sharedData.managedKids = result[1].body.managed_kids;
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
                    this.managed_kids = new ObservableArray<ManagedKid>();
                    var body = result.body;
                    body.managed_kids.forEach((managedKid) => {
                        this.addNewManagedKid(managedKid);
                    });

                    this.isLoading = false;
                    // save managed kids in SharedData Provider, so data will be available to all components
                    this.sharedData.managedKids = body.managed_kids;

                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    addNewManagedKid(managedKid){
        let kid = new ManagedKid(managedKid.fname, managedKid.lname, managedKid.nickname,
            managedKid.age, managedKid.reminders_count, managedKid.messages_count,
            managedKid.kid_klid, managedKid.photograph_url, managedKid.in_or_out_time);
        this.managed_kids.push(kid);
    }


    // pull to refresh the data
    public onPullToRefreshInitiated(args: ListViewEventData) {
        var that = new WeakRef(this);
        timerModule.setTimeout(()=> {
            let initialNumberOfItems = that.get().numberOfAddedItems;
            let listView = args.object;
            this.myClassService.getManagedKids(this.currentRoom)
                .subscribe(
                    (result) => {
                        this.managed_kids = new ObservableArray<ManagedKid>();
                        var body = result.body;
                        body.managed_kids.forEach((managedKid) => {
                            this.addNewManagedKid(managedKid);
                        });
                        // save managed kids in SharedData Provider, so data will be available to all components
                        this.sharedData.managedKids = body.managed_kids;
                        listView.notifyPullToRefreshFinished();
                    },
                    (error) => {
                        listView.notifyPullToRefreshFinished();
                        this.serverErrorService.showErrorModal();
                    }
                );
        }, 1000);
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

    /*kidLoaded(args) {
     let kidStackLayout = args.object;
     kidStackLayout.observe(gestures.GestureTypes.tap | gestures.GestureTypes.longPress, (args) => {
     //console.log("Event: " + args.eventName + ", sender: " + args.object);
     let kid = args.object.get("kid");
     if (args.eventName === 'tap') {
     console.log("Tap")
     } else if (args.eventName === 'longPress') {
     console.log("Long Press")
     console.log("Event  longPress");
     //this.onLongPressKid(kid);
     }
     });
     }*/


    onTapKid(args: ListViewEventData) {
        let kid = this.managed_kids.getItem(args.itemIndex);
        this.kidData.info = kid;

        let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);
        kidStackLayout.animate(
            { backgroundColor: '#DCDCDC', duration: 100 }
        ).then(() => {
            this.cancelKidSelectionAnimation(kid);
        }).catch(()=>{
            // animation error
        });

        this.routerExtensions.navigate(["/kid-dashboard"], {
            transition: {
                name: "slideLeft"
            }
        })
    }

    onLongPressKid(args: ListViewEventData) {
        let kid = this.managed_kids.getItem(args.itemIndex);

        let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);
        kidStackLayout.animate(
            {backgroundColor: '#DCDCDC', duration: 100}
        ).then(()=> {
            // animationDone
        }).catch(()=> {
            // animation error
        })

        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Sign-in/Sign-out", "Message to Parent"]
        }).then(result => {
            if (result == 'Cancel' || typeof result == "undefined") {
                this.cancelKidSelectionAnimation(kid);
            } else {
                if (result === 'Sign-in/Sign-out') {
                    this.signInOrSignOutKid(kid);
                } else if (result === "Message to Parent") {
                    this.showModalMessageToParent(kid);
                }
            }
        })

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
            console.log("Result " + result);
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
    cancelKidSelectionAnimation(kid) {
        let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);
        kidStackLayout.animate(
            {backgroundColor: 'white', duration: 500}
        ).then(()=> {
            // animationDone
        }).catch(()=> {
            // animation error
        })
    }


}