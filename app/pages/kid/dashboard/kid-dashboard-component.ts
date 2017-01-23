import {Component, ViewContainerRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import {PostService, Post, TaggedTo, Comment} from "../../../shared/post.service";
import frameModule = require("ui/frame");
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import dialogs = require("ui/dialogs");
import {GC} from 'utils/utils';

import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ModalPostComment} from "../../../pages/dialogs/modal-post-comment";
import {ServerErrorService} from "../../../shared/server.error.service";

let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');
let app = require("application");
let cameraModule = require("camera");
let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let enums = require("ui/enums");
let imagepicker = require("nativescript-imagepicker");
let nstoasts = require("nativescript-toasts");
let PhotoViewer = require("nativescript-photoviewer");
let photoViewer = new PhotoViewer();

declare var android: any;


@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-dashboard.css'],
    templateUrl: './kid-dashboard.html',
    providers: [PostService, ModalDialogService, ServerErrorService]
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
    public showActionBarItems: Boolean = false;

    constructor(private postService: PostService,
                private modal: ModalDialogService,
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
        this.kid = kidData.info;
        this.posts = [];
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    static entries = [
        ModalPostComment
    ];

    static exports = [
        ModalPostComment
    ];


    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        //this.page.actionBarHidden = true;
        // this.kid = this.kidData.info;
        // Hide 'Default Back button'
        if (this.isIos) {
            var controller = frameModule.topmost().ios.controller;
            // get the view controller navigation item
            var navigationItem = controller.visibleViewController.navigationItem;
            // hide back button
            navigationItem.setHidesBackButtonAnimated(true, false);
        }

        // show actionBarItems after some time to fix overlapping issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);

        this.getPosts();
    }



    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.postService.getPosts(this.kid.kid_klid)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.posts = body.posts;
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    getPosts(commentedOnPost = false){
        this.isLoading = true;
        this.postService.getPosts(this.kid.kid_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.posts = body.posts;
                    this.isLoading = false;
                    //console.log("POSTS "+ JSON.stringify(this.posts));
                    if(commentedOnPost){
                        // show toast
                        nstoasts.show({
                            text: 'Your comment added',
                            duration: nstoasts.DURATION.SHORT
                        });
                    }
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

            } else {
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
            // The GC() function is called to clean up the mess in the memory let by camera.takePicture().
            // Without this, the application on Android will constantly crash after some pictures,
            // leaving us with nothing but OutOfMemory exceptions
            GC();
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
                        this.routerExtensions.navigate(["/kid-moment"], {
                            transition: {
                                name: 'slideUp'
                            }
                        });

                    }).catch((e) => {
                    //console.log("Error: " + e);
                    //console.log(e.stack);
                });
            }).catch((e) => {
            //console.log(e);
        });
    }

    goBack() {
        //this.routerExtensions.backToPreviousPage();
        this.routerExtensions.navigate(["/myclass"], {
            transition: {
                name: "slideRight"
            }
        });
    }

    addOrRemoveHeart(post) {
        let heartIconImage = view.getViewById(this.page, "post-add-remove-heart-" + post.kl_id);
        let heartedImage = view.getViewById(this.page, "post-hearted-image-" + post.kl_id);
        let activityIndicator = view.getViewById(this.page, "post-add-remove-heart-indicator-" + post.kl_id);
        let isHearted = heartIconImage.className === 'hearted' ? true : false
        //this.isLoading = true;
        heartIconImage.visibility = 'collapsed';
        activityIndicator.visibility = 'visible';

        this.postService.addOrRemoveHeart(post, isHearted)
            .subscribe(
                (result) => {
                    //this.isLoading = false;
                    let body = result.body;
                    if (isHearted) {
                        // remove heart
                        heartIconImage.src = 'res://heart_icon_light';
                        heartIconImage.visibility = 'visible';
                        activityIndicator.visibility = 'collapsed';
                        heartIconImage.className = 'not-hearted';

                        heartedImage.floatOut('slow', 'left').then(() => {
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
                    //this.isLoading = false;
                    //alert('Internal server error.');
                }
            );

    }

    openKidProfile(kid) {


        if (this.isIos) {
            this.routerExtensions.navigate(["/kid-profile"], {
                transition: {
                    name: 'curl',
                    duration: 500,
                    curve: "easeIn"
                }
            });
        } else {
            this.routerExtensions.navigate(["/kid-profile"], {
                transition: {
                    name: "slideTop"
                }
            });
        }

    }

    // edit , delete post etc..
    selectPostActions(post) {
        let actions = [];
        if (post.can_edit) {
            //TODO enable after completing the editPostSection
            //actions.push('Edit')
        }
        if (post.can_delete) {
            actions.push('Delete')
        }
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: actions
        }).then(result => {
            if (result === 'Delete') {
                this.deletePost(post);
            } else if (result === 'Edit') {
                //TODO
            }

        });
    }


    deletePost(post) {
        let postGridLayout = view.getViewById(this.page, "post-" + post.kl_id);
        this.isLoading = true;
        this.postService.deletePost(post.kl_id).subscribe(
            (result) => {
                this.isLoading = false;

                postGridLayout.floatOut('slow', 'left').then(() => {
                    // hide deleted post
                    postGridLayout.visibility = 'collapsed';
                    // remove current post from list
                    let currentPost = this.posts.filter(post => post.kl_id === post.kl_id)[0];
                    let index = this.posts.indexOf(currentPost);
                    this.posts.splice(index, 1);
                    // show toast
                    nstoasts.show({
                        text: result.message,
                        duration: nstoasts.DURATION.SHORT
                    });
                });

            },
            (error) => {
                this.isLoading = false;
                this.serverErrorService.showErrorModal();
            }
        );
    }

    showHearters(post) {
        // assign post kl_id to sharedData to available in next screen
        this.sharedData.postKlId = post.kl_id;

        this.routerExtensions.navigate(["/post-hearters"], {
            transition: {
                name: "slideLeft",
                duration: 300,
                curve: "easeInOut"
            }
        });
    }

    openPostImages(post) {
        // Add to array and pass to showViewer
        // add multiple images if post has
        let postImages = [];
        postImages.push(post.large_image);
        photoViewer.showViewer(postImages);
    }


    showModalCommentToPost(post) {
        var options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                post_kl_id: post.kl_id,
                post_slug: post.slug
            },
            fullscreen: false
        };

        this.modal.showModal(ModalPostComment, options).then((result) => {
            if(result === 'close'){
              // modal closed
            }else{
                //TODO add comment details as childView to parent instead refresh
                //console.log("Modal Comment Result " + JSON.stringify(result));/
                this.getPosts(true);
            }

        })
    }

}