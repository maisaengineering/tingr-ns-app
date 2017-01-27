import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import {ServerErrorService} from "../../../shared/server.error.service";
import {KidService} from "../../../shared/kid.service";
import { PostService } from "../../../shared/post.service";
import {GC} from 'utils/utils';

var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");

var cameraModule = require("camera");

import { ImageAsset } from "image-asset";
var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");
let imagepicker = require("nativescript-imagepicker");
import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-moment.css'],
    templateUrl: './kid-moment.html',
    providers: [KidService, PostService, ServerErrorService]
})
export class KidMomentComponent implements OnInit {
    public kid: any;
    public managedKids: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public additionalDetails: string;
    public taggedKidIds: Array<any> = [];
    public s3_key: string;
    public selectedImages = [];
    public showActionBarItems: Boolean = false;

    constructor(private kidService: KidService,
                private postService: PostService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        //super(changeDetectorRef);
        this.kid = {};
        this.kid = this.kidData.info;
        this.managedKids = this.sharedData.managedKids;
        this.kid = this.kidData.info;
        this.additionalDetails = '';
        // by default add this kid to tag
        this.taggedKidIds = [];
        this.s3_key = '';
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
        }, 500);

        // auto tag currentKid
        this.taggedKidIds.push(this.kid.kid_klid)
        let managedKid = this.managedKids.filter(mk => mk.kid_klid === this.kid.kid_klid)[0];
        managedKid.isTagged = managedKid ? true : false
        let momentImageVIew = view.getViewById(this.page, 'moment-image');
        momentImageVIew.src = this.sharedData.momentCaptureDetails.imageAsset;
        momentImageVIew.visibility = 'visible';
        // get s3 in background
        this.getS3Key();
        let addDetailsTextField = view.getViewById(this.page, "moment-additional-details");
        //addDetailsTextField.focus();
    }

    goBack(){
       // this.routerExtensions.backToPreviousPage();
        this.routerExtensions.navigate(["/kid-dashboard"], {
            transition: {
                name: "slideRight"
            }
        });
    }

    getS3Key(){
        this.s3_key = ''; // set key to empty to show activity indicator
        //this.isLoading = true;
        //console.log('Getting S3 key ....');
        this.postService.uploadToS3(this.sharedData.momentCaptureDetails.imageBase64Data)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.s3_key = body.key;
                   // this.isLoading = false;
                    //console.log('New S3 key + '+this.s3_key);
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    selectMomentCaptureOption() {
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Take photo", "Choose existing"]
        }).then(result => {
            if(result === 'Take photo'){
                this.takePicture();
            }else if(result === 'Choose existing'){
                this.selectFromGallery();
            }
        });
    }

    takePicture(){
       let momentImageView = view.getViewById(this.page, 'moment-image');
        let options = {
            width: 800,
            height: 800,
            keepAspectRatio: false,
            saveToGallery: false
        };
        cameraModule.takePicture(options).then((imageAsset) => {
            let imageBase64Data =  imageAsset.toBase64String(enums.ImageFormat.jpeg);
            momentImageView.src = imageAsset;
            this.sharedData.momentCaptureDetails = {
                imageBase64Data: imageBase64Data,
                imageAsset: imageAsset
            };

            // The GC() function is called to clean up the mess in the memory let by camera.takePicture().
            // Without this, the application on Android will constantly crash after some pictures,
            // leaving us with nothing but OutOfMemory exceptions
            GC();

            // get s3_key for newly upload image
            this.getS3Key();
        });
    }

    selectFromGallery() {
        let context = imagepicker.create({
            mode: "single"
        });
        this.startImageSelection(context);
    }

    startImageSelection(context) {
        let momentImageVIew = view.getViewById(this.page, 'moment-image');

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
                    .getImage({maxWidth: 800, maxHeight: 800})
                    .then((imageSource) => {
                        this.sharedData.momentCaptureDetails = {
                            imageBase64Data: imageSource.toBase64String(enums.ImageFormat.jpeg),
                            imageAsset: imageSource
                        };

                        momentImageVIew.src = this.sharedData.momentCaptureDetails.imageAsset;
                        momentImageVIew.visibility = 'visible';
                        this.s3_key = '';
                        this.getS3Key(); // get s3_key for newly upload image

                    }).catch((e) => {
                    //console.log("Error: " + e);
                    //console.log(e.stack);
                });
                GC();
            }).catch((e) => {
            console.log(e);
        });

    }

    tagKid(kid_klid){
        let kidContainer = view.getViewById(this.page, "kid-container-" + kid_klid);
        let checkBoxImg = view.getViewById(this.page, "checkbox-" + kid_klid);
        if(kidContainer.classList.contains('checked')){
            console.log('is checked   uncheck it');
            kidContainer.classList.remove('item-selected','checked');
            kidContainer.classList.add('unchecked');
            checkBoxImg.src = '~/images/check-box-unchecked.png';
            this.taggedKidIds.splice(this.taggedKidIds.indexOf(kid_klid), 1);
        }else if(kidContainer.classList.contains('unchecked')){
            console.log('is unchecked  check it');
            kidContainer.classList.add('item-selected');
            kidContainer.classList.remove('unchecked');
            kidContainer.classList.add('checked');
            checkBoxImg.src = '~/images/check-box-checked.png';
            this.taggedKidIds.push(kid_klid);
        }
    }

    saveMoment(){
        this.isLoading = true;
        let createdAt = new Date();
        this.postService.createPost(createdAt, this.additionalDetails.trim(), this.taggedKidIds, this.s3_key)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.isLoading = false;

                    let toastOptions = {
                        text: 'Moment added successfully',
                        duration : nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(toastOptions);

                    this.routerExtensions.navigate(["/kid-dashboard"], {
                        transition: {
                            name: "slideRight"
                        }
                    });
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

}