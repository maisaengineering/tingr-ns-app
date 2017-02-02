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

require( "nativescript-dom" );
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');
let app = require("application");

let cameraModule = require("camera");

import { ImageAsset } from "image-asset";
let enums = require("ui/enums");
let nstoasts = require("nativescript-toasts");
let imagepicker = require("nativescript-imagepicker");
import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-moment.css'],
    templateUrl: './edit-moment.html',
    providers: [KidService, PostService, ServerErrorService]
})
export class KidEditMomentComponent implements OnInit {
    public kid: any;
    public managedKids: any;
    public currentPost: any;
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
        this.currentPost = this.sharedData.currentPost;
        this.kid = this.kidData.info;
        this.additionalDetails = '';
        // by default add this kid to tag
        this.taggedKidIds = [];
        this.s3_key = 'exists'; // editing post
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

        //set image and additional details with existing data
        let momentImageVIew = view.getViewById(this.page, 'moment-image');
        if(this.currentPost.image){
            momentImageVIew.src = this.currentPost.image;
        }
        momentImageVIew.visibility = 'visible';
        this.additionalDetails = this.currentPost.text;

        // set already TaggedKidIds
        this.currentPost.tagged_to.forEach((taggedKid) => {
            this.taggedKidIds.push(taggedKid.kl_id); // add already taggedKid to list
            // add extra attribute isTagged to managedKid when he already tagged..
            let managedKid = this.managedKids.filter(mk => mk.kid_klid === taggedKid.kl_id)[0];
            if(managedKid) {
                managedKid.isTagged = true
            }
        });

        console.log("currentPOSt " + JSON.stringify(this.currentPost));
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
            saveToGallery: true
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
                    .getImage()
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

    updateMoment(){
        this.isLoading = true;
        let updatedAt = new Date();
        let new_s3_key =  this.s3_key == 'exists' ? '' : this.s3_key;
        this.postService.updatePost(this.currentPost.kl_id,updatedAt, this.additionalDetails.trim(), this.taggedKidIds, new_s3_key)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.isLoading = false;

                    let toastOptions = {
                        text: result.message,
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
                    console.error(error.stack);
                    console.log("Error "+ error);
                    this.serverErrorService.showErrorModal();
                }
            );
    }

}