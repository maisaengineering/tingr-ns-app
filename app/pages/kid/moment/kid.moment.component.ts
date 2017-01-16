import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import {KidService} from "../../../shared/kid.service";
import { PostService } from "../../../shared/post.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");

var cameraModule = require("camera");

import { ImageAsset } from "image-asset";
var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-moment.css'],
    templateUrl: './kid-moment.html',
    providers: [KidService, PostService]
})
export class KidMomentComponent implements OnInit {
    public kid: any;
    public momentCaptureDetails: any;
    public managedKids: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public additionalDetails: string;
    public taggedKidIds: Array<any> = [];
    public s3_key: string;

    constructor(private kidService: KidService,
                private postService: PostService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.kid = {};
        this.kid = kidData.info;
        this.momentCaptureDetails = sharedData.momentCaptureDetails;
        this.managedKids = sharedData.managedKids;
        this.kid = kidData.info;
        this.additionalDetails = '';
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
        var momentImageVIew = view.getViewById(this.page, 'moment-image');
        momentImageVIew.src = this.momentCaptureDetails.imageAsset;
        momentImageVIew.visibility = 'visible';
        // get s3 in background
        this.getS3Key();
        let addDetailsTextField = view.getViewById(this.page, "moment-additional-details");
        //addDetailsTextField.focus();
    }

    getS3Key(){
        this.s3_key = ''; // set key to empty to show activity indicator
        this.postService.uploadToS3(this.momentCaptureDetails.imageBase64Data)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.s3_key = body.key;
                    this.isLoading = false;
                },
                (error) => {
                    console.log("ERRROR :" + JSON.stringify(error));
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }

    capturePhoto(){
       let momentImageView = view.getViewById(this.page, 'moment-image');
        let options = {
            width: 800,
            height: 800,
            keepAspectRatio: false,
            saveToGallery: false
        };
        cameraModule.takePicture(options).then((imageAsset) => {
            let imageBase64Data =  imageAsset.toBase64String(enums.ImageFormat.jpeg);
            let imageFileName =  new Date().getTime() + 'jpeg';
            momentImageView.src = imageAsset;
            this.sharedData.momentCaptureDetails = {
                imageBase64Data: imageBase64Data,
                imageAsset: imageAsset
            };
            // get s3_key with newly upload image
            this.getS3Key();
        });
    }


    tagKid(kid_klid){
        let kidContainer = view.getViewById(this.page, "kid-container-" + kid_klid);
        let checkBoxImg = view.getViewById(this.page, "checkbox-" + kid_klid);
        let isChecked = kidContainer.className === 'checked' ? true : false;
        if(isChecked){
            //uncheck
            kidContainer.className = 'unchecked';
            checkBoxImg.src = '~/images/check-box-unchecked.png';
            this.taggedKidIds.splice(this.taggedKidIds.indexOf(kid_klid), 1);
        }else {
            //check
            kidContainer.className = 'checked';
            checkBoxImg.src = '~/images/check-box-checked.png';
            this.taggedKidIds.push(kid_klid);
        }
    }

    saveMoment(){
        this.isLoading = true;
        let createdAt = new Date();
        console.log("Off Set "+ createdAt.getTimezoneOffset());
        console.log("additionalDetails "+ this.additionalDetails);
        console.log("taggedKidIds "+ this.taggedKidIds);
        console.log("s3_key "+ this.s3_key);
        this.postService.createPost(createdAt, this.additionalDetails, this.taggedKidIds, this.s3_key)
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
                    console.log("ERRORRRRR "+JSON.stringify(error));
                    alert('Internal server error.');
                }
            );
    }

}