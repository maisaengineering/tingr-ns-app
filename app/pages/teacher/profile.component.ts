import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {RouterExtensions} from 'nativescript-angular/router';
import {TeacherService} from "../../shared/teacher/teacher.service";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import {TeacherInfo} from "../../providers/data/teacher_info";
import {ModalEditProfile} from "../../pages/dialogs/modal-edit-profile";
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let cameraModule = require("camera");
import {GC} from 'utils/utils';
let enums = require("ui/enums");
let imagepicker = require("nativescript-imagepicker");
import dialogs = require("ui/dialogs");
let view = require("ui/core/view");
let nstoasts = require("nativescript-toasts");
let app = require("application");

declare var android: any;
@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './profile.html',
    styleUrls: ["./profile.css"],
    providers: [TeacherService, ServerErrorService, ModalDialogService]
})
export class TeacherProfileComponent implements OnInit {
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public teacherInfo: any;
    public selectedImages = [];
    public picUploaded: Boolean = false;

    constructor(private page: Page, private location: Location,
                private modal: ModalDialogService,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        this.teacherInfo = TeacherInfo.parsedDetails;
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();

    }



    goBack() {
        this.routerExtensions.navigate(["/calendar"], {
            transition: {
                name: "slideRight"
            },
        });
    }

    selectMomentCaptureOption() {
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Take photo", "Choose existing"]
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
            }
        });
    }


    takePicture() {
        let teacherProfilePicView = view.getViewById(this.page, 'teacherProfilePic');
        let options = {
            saveToGallery: this.isAndroid ? false : true
        };
        cameraModule.takePicture(options).then((imageAsset) => {

            let imageBase64Data =  imageAsset.toBase64String(enums.ImageFormat.jpeg);
            this.picUploaded = true;
            teacherProfilePicView.src = imageAsset;
            this.changePhoto(imageBase64Data);
            GC();
        });
    }

    selectFromGallery() {
        let context = imagepicker.create({
            mode: "single"
        });
        this.startImageSelection(context);
    }

    startImageSelection(context) {
        let teacherProfilePicView = view.getViewById(this.page, 'teacherProfilePic');

        context
            .authorize()
            .then(() => {
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

                        let imageBase64Data = imageSource.toBase64String(enums.ImageFormat.jpeg);
                        this.picUploaded = true;
                        teacherProfilePicView.src = imageSource;
                        this.changePhoto(imageBase64Data);

                    }).catch((e) => {
                    //console.log("Error: " + e);
                    //console.log(e.stack);
                });
                GC();
            }).catch((e) => {
            //console.log(e);
        });

    }

    changePhoto(imageBase64Data){
        nstoasts.show({
            text: 'Photo updated',
            duration: nstoasts.DURATION.SHORT
        });
       let teacher_klid = this.teacherInfo.teacher_klid;
        this.teacherService.changePhotoGraph(imageBase64Data,teacher_klid)
            .subscribe(
                (result) => {
                   let body = result.body;
                    this.teacherInfo.photograph = body.photograph;
                    //update teacher info in app settings
                    TeacherInfo.details = JSON.stringify(this.teacherInfo);
                },
                (error) => {
                    console.log("error "+ JSON.stringify(error));
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    openEditModal(){
        var options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                teacher_klid: this.teacherInfo.teacher_klid,
                fname: this.teacherInfo.fname,
                lname: this.teacherInfo.lname,

            },
            fullscreen: true
        };
            this.modal.showModal(ModalEditProfile, options).then((result) => {
                if (result === 'close' || typeof(result) == "undefined") {
                    // modal closed
                } else {
                    this.teacherInfo.fname = result.fname;
                    this.teacherInfo.lname = result.lname;
                    nstoasts.show({
                        text: 'Profile updated',
                        duration: nstoasts.DURATION.SHORT
                    });
                    // invoke api in background to update
                    this.updateProfile(result);
                }
            })
    }


    updateProfile(data){
        let teacher_klid = this.teacherInfo.teacher_klid;
        this.teacherService.updateProfile(data,teacher_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.teacherInfo.fname = body.fname;
                    this.teacherInfo.lname = body.lname;
                    this.teacherInfo.email = body.email;
                    this.teacherInfo.photograph = body.photograph;
                    //update teacher info in app settings
                    TeacherInfo.details = JSON.stringify(this.teacherInfo);
                },
                (error) => {
                   //console.log("error "+ JSON.stringify(error));
                }
            );
    }



}
