import {Component, ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {MyClassService, ManagedKid, Room} from "../../shared/myclass.service";
import {KidSignInOutService} from "../../shared/kid-signinout.service";
import {MessageService} from "../../shared/message.service";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {KidData} from "../../providers/data/kid_data";
import {SharedData} from "../../providers/data/shared_data";
import {RouterExtensions} from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
import {Page} from "ui/page";
import {TeacherInfo} from "../../providers/data/teacher_info";
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ServerErrorService} from "../../shared/server.error.service";
import dialogs = require("ui/dialogs");
import {DatePipe} from '@angular/common';
import {InternetService} from "../../shared/internet.service";
import {ModalMessageToParent} from "../dialogs/modal-message-to-parent";
import {GC} from 'utils/utils';

import {ListViewEventData} from "nativescript-telerik-ui/listview";
import * as timerModule  from "timer";
import listViewModule = require("nativescript-telerik-ui/listview/angular");
import listViewAnularModule = require("nativescript-telerik-ui/listview/angular");

let cameraModule = require("camera");
let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let enums = require("ui/enums");
let imagepicker = require("nativescript-imagepicker");
declare let android: any;


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
        MessageService, TeacherService, ModalDialogService, ServerErrorService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyClassComponent extends DrawerPage implements OnInit {
    private managed_kids: any;
    public roomName: String;
    public currentRoom;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public assignedRooms: Array<any>;
    public showActionBarItems: Boolean = false;
    private numberOfAddedItems; // pull to refresh
    public selectedImages = [];


    constructor(private myClassService: MyClassService,
                private modal: ModalDialogService,
                private kidSignInOutService: KidSignInOutService,
                private changeDetectorRef: ChangeDetectorRef,
                private kidData: KidData,
                private sharedData: SharedData,
                private routerExtensions: RouterExtensions,
                private router: Router,
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

        //this.getRoomsAndMangedKids();
        this.loadManagedKids(this.currentRoom);
        this.getAssignedRooms();
        //  this.changeDetectorRef.detectChanges();
    }


    getAssignedRooms() {
        this.myClassService.getAssignedRooms().subscribe(
            (result) => {
                this.assignedRooms = result.body.rooms;
                this.changeDetectorRef.markForCheck();
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
                    this.managed_kids = [];
                    var body = result.body;
                    body.managed_kids.forEach((managedKid) => {
                        this.addNewManagedKid(managedKid);
                    });
                    // save managed kids in SharedData Provider, so data will be available to all components
                    this.sharedData.managedKids = body.managed_kids;
                    this.isLoading = false;
                    this.changeDetectorRef.markForCheck();
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    addNewManagedKid(managedKid) {
        let kid = new ManagedKid(managedKid.fname, managedKid.lname, managedKid.nickname,
            managedKid.age, managedKid.reminders_count, managedKid.messages_count,
            managedKid.kid_klid, managedKid.photograph_url, managedKid.in_or_out_time);
        this.managed_kids.push(kid);
    }

    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.myClassService.getManagedKids(this.currentRoom)
            .subscribe(
                (result) => {
                    this.managed_kids = [];
                    var body = result.body;
                    body.managed_kids.forEach((managedKid) => {
                        this.addNewManagedKid(managedKid);
                    });
                    // save managed kids in SharedData Provider, so data will be available to all components
                    this.sharedData.managedKids = body.managed_kids;
                    this.changeDetectorRef.markForCheck();
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    pullRefresh.refreshing = false;
                    this.serverErrorService.showErrorModal();
                }
            );
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
                        this.managed_kids = [];
                        var body = result.body;
                        body.managed_kids.forEach((managedKid) => {
                            this.addNewManagedKid(managedKid);
                        });
                        // save managed kids in SharedData Provider, so data will be available to all components
                        this.sharedData.managedKids = body.managed_kids;
                        listView.notifyPullToRefreshFinished();
                        this.changeDetectorRef.markForCheck();
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
                    this.changeDetectorRef.markForCheck();
                }
            }


        });
    }

    /*onTapKid(args: ListViewEventData) {
        let kid = this.managed_kids[args.itemIndex];
        this.kidData.info = kid;
        this.changeDetectorRef.markForCheck();
        //let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);
        this.routerExtensions.navigate(["/kid-dashboard"], {
            transition: {
                name: "slideLeft"
            }
        })
    }*/

    onLongPressKid(kid) {

        //let kidStackLayout = view.getViewById(this.page, 'kid-' + kid.kid_klid);

        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Sign-in", "Sign-out", "Message to Parent", "View Profile"]
        }).then(result => {
            if (result == 'Cancel' || typeof result == "undefined") {
                this.cancelKidSelectionAnimation(kid);
            } else {
                if (result === 'Sign-in') {
                    this.signInOrSignOutKid(kid,'Sign-in');
                }
                else if (result === 'Sign-out') {
                    this.signInOrSignOutKid(kid,'Sign-out');
                } else if (result === "Message to Parent") {
                    this.showModalMessageToParent(kid);
                } else if (result === "View Profile") {
                    this.kidData.info = kid;
                    this.routerExtensions.navigate(["/kid-dashboard"], {
                        transition: {
                            name: "slideLeft"
                        }
                    })
                }
            }
        })

    }

    signInOrSignOutKid(kid, option) {

        let inoutTimeLabel = view.getViewById(this.page, "in-or-out-time-" + kid.kid_klid);
        this.isLoading = true;
        this.kidSignInOutService.signInOrSingOut(kid.kid_klid, option)
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
                        kid.in_or_out_time = body.in_or_out_time;
                        inoutTimeLabel.text = body.in_or_out_time; // update label with result
                        inoutTimeLabel.parent.visibility = 'visible'; // show parent
                        try {
                            inoutTimeLabel.shake(); //shake effect
                        } catch (err) {
                            // may be page redirected kid-dashboard
                        }
                    }
                    this.changeDetectorRef.markForCheck();
                    this.cancelKidSelectionAnimation(kid);
                    //this.managed_kids.refresh();
                },
                (error) => {
                   // this.cancelKidSelectionAnimation(kid);
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


    selectMomentCaptureOption() {
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Take photo", "Choose existing", "Text only"]
        }).then(result => {
            if (result === 'Take photo') {
                //  Android permissions (mainly for API 23+/Android 6+) check inplace
                // This wraps up the entire Android 6 permissions system into a nice easy to use promise.
                // In addition, you can also have multiple permissions pending and each one will resolve properly
                if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
                    permissions.requestPermission(android.Manifest.permission.CAMERA, "Allow Tingr to access your camera?")
                        .then(() => {
                            //console.log("CAMERA Permission: granted!");
                            this.takePicture();
                        })
                        .catch(() => {
                            //console.log("CAMERA Permission: -- refused");
                        });
                } else {
                    this.takePicture();
                }

            } else if (result === 'Choose existing') {
                if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
                    permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "Allow Tingr to access your gallery?")
                        .then(() => {
                            //console.log("READ_EXTERNAL_STORAGE permission: granted!");
                            this.selectFromGallery();
                        })
                        .catch(() => {
                            //console.log("READ_EXTERNAL_STORAGE permission: -- refused");
                        });
                } else {
                    this.selectFromGallery();
                }
            } else if (result === 'Text only') {

                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        "textOnly": true,
                        "fromClassRoomPage": true
                    }
                };
                this.router.navigate(["kid-moment"], navigationExtras);
            }
        });
    }


    takePicture() {
        //TODO check for android if not working: https://github.com/NativeScript/NativeScript/issues/2353
        //var imageView = view.getViewById(this.page, 'kid-profile-picture');
        let options = {
            saveToGallery: this.isAndroid ? false : true
        };
        cameraModule.takePicture(options).then((imageAsset) => {
            let imageBase64Data = imageAsset.toBase64String(enums.ImageFormat.jpeg);
            this.sharedData.momentCaptureDetails = {
                imageBase64Data: imageBase64Data,
                imageAsset: imageAsset
            };
            // The GC() function is called to clean up the mess in the memory let by camera.takePicture().
            // Without this, the application on Android will constantly crash after some pictures,
            // leaving us with nothing but OutOfMemory exceptions
            GC();

            let navigationExtras: NavigationExtras = {
                queryParams: {
                    "fromClassRoomPage": true
                }
            };
            this.router.navigate(["kid-moment"], navigationExtras);


        });

    }

    selectFromGallery() {
        let context = imagepicker.create({
            mode: "single"
        });
        this.startImageSelection(context);
    }

    startImageSelection(context) {
        context
            .authorize()
            .then(() => {
                this.selectedImages = [];
                return context.present();
            })
            .then((selection) => {
                //console.log("Selection done:");
                selection.forEach((selected) => {
                    //TODO for multiple seelction follow below coding for each one
                    // console.log("----------------");
                    // console.log("uri: " + selected.uri);
                    // console.log("fileUri: " + selected.fileUri);
                });
                this.selectedImages = selection;
                // this.changeDetectionRef.detectChanges();
                let selectedImage = this.selectedImages[0];
                selectedImage
                    .getImage()
                    .then((imageSource) => {
                        this.sharedData.momentCaptureDetails = {
                            imageBase64Data: imageSource.toBase64String(enums.ImageFormat.jpeg),
                            imageAsset: imageSource
                        };
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                "fromClassRoomPage": true
                            }
                        };
                        this.router.navigate(["kid-moment"], navigationExtras);

                    }).catch((e) => {
                    //console.log("Error: " + e);
                    //console.log(e.stack);
                });
            }).catch((e) => {
            //console.log(e);
        });
    }


}