import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import {PostService, Post, TaggedTo, Comment} from "../../../shared/post.service";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');
let app = require("application");

let cameraModule = require("camera");

import {ImageAsset} from "image-asset";
let enums = require("ui/enums");
let imagepicker = require("nativescript-imagepicker");
import dialogs = require("ui/dialogs");


export class DataItem {
    constructor(public itemDesc: string) {
    }
}

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-dashboard.css'],
    templateUrl: './kid-dashboard.html',
    providers: [PostService]
})
export class KidDashboardComponent implements OnInit {
    public kid: any;
    public posts: Array<any>;
    public comments: Array<Comment>;
    public tagged_to: Array<TaggedTo>;
    public topmost;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public selectedImages = [];

    constructor(private postService: PostService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);

        this.kid = {};
        this.kid = kidData.info;
        this.posts = [];
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    selectMomentCaptureOption() {
        dialogs.action({
            // message: "Your message",
            cancelButtonText: "Cancel",
            actions: ["Take photo", "Choose existing"]
        }).then(result => {
            if (result === 'Take photo') {
                this.takePicture();
            } else {
                this.selectFromGallery();
            }
        });
    }


    takePicture() {
        //TODO check for android if not working: https://github.com/NativeScript/NativeScript/issues/2353
        //var imageView = view.getViewById(this.page, 'kid-profile-picture');
        let options = {
            width: 800,
            height: 800,
            keepAspectRatio: false,
            saveToGallery: false
        };
        cameraModule.takePicture(options).then((imageAsset) => {
            let imageBase64Data = imageAsset.toBase64String(enums.ImageFormat.jpeg);
            this.sharedData.momentCaptureDetails = {
                imageBase64Data: imageBase64Data,
                imageAsset: imageAsset
            };
            this.routerExtensions.navigate(["/kid-moment"], {
                transition: {
                    name: "slideLeft"
                }
            });
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
                console.log("Selection done:");
                selection.forEach(function(selected) {
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
                        this.routerExtensions.navigate(["/kid-moment"], {
                            transition: {
                                name: 'slideUp'
                            }
                        });

                    }).catch(function (e) {
                    console.log("Error: " + e);
                    console.log(e.stack);
                });
            }).catch(function (e) {
            console.log(e);
        });
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        //this.page.actionBarHidden = true;
        // this.kid = this.kidData.info;
        this.isLoading = true;
        this.postService.getPosts(this.kid.kid_klid)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.posts = body.posts;
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }

    goBack() {
        /*this.routerExtensions.navigate(["/myclass"], {
         transition: {
         name: "slideRight"
         }
         });*/

        this.routerExtensions.back();
        //this.routerExtensions.backToPreviousPage();
        //this.routerExtensions.back();
        //this.routerExtensions.backToPreviousPage();
        //this.router.navigate(['/myclass']);
        //  this.topmost.goBack();
        //Perhaps the simplest way to navigate is by specifying the file name of the page to which you want to navigate.
        //this.topmost.navigate("myclass");

    }

    addOrRemoveHeart(post) {
        let heartIconImage = view.getViewById(this.page, "post-add-remove-heart-" + post.kl_id);
        let heartedImage = view.getViewById(this.page, "post-hearted-image-" + post.kl_id);
        let activityIndicator = view.getViewById(this.page, "post-add-remove-heart-indicator-" + post.kl_id);
        let isHearted = heartIconImage.className === 'hearted' ? true : false
        this.isLoading = true;
        heartIconImage.visibility = 'collapsed';
        activityIndicator.visibility = 'visible';

        this.postService.addOrRemoveHeart(post, isHearted)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    let body = result.body;
                    if (isHearted) {
                        // remove heart
                        heartIconImage.src = 'res://heart_icon_light';
                        heartIconImage.visibility = 'visible';
                        activityIndicator.visibility = 'collapsed';
                        heartIconImage.className = 'not-hearted';

                        heartedImage.floatOut('slow', 'left').then(function () {
                            heartedImage.visibility = "collapsed";
                        });
                    } else {
                        //add heart
                        heartIconImage.src = 'res://heart_icon_gray';
                        heartIconImage.visibility = 'visible';
                        heartIconImage.className = 'hearted';
                        activityIndicator.visibility = 'collapsed';


                        heartedImage.visibility = "collapsed";
                        heartedImage.src = body.asset_base_url + body.heart_icon;
                        heartedImage.visibility = "visible";
                        heartedImage.floatIn('slow', 'left');
                    }

                },
                (error) => {
                    this.isLoading = false;
                    //alert('Internal server error.');
                }
            );

    }

    openKidProfile(kid) {
        if (this.isIos) {
            this.routerExtensions.navigate(["/kid-profile"], {
                transition: {
                    name: 'curl',
                    duration: 700
                }
            });
        } else {
            this.routerExtensions.navigate(["/kid-profile"], {
                transition: {
                    name: 'slideUp'
                }
            });
        }

    }


}