import {Component, ViewContainerRef, ChangeDetectorRef, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {Page} from "ui/page";
import {PostService, Post, TaggedTo, Comment} from "../../../shared/post.service";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import dialogs = require("ui/dialogs");
import {GC} from 'utils/utils';

import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ModalPostComment} from "../../../pages/dialogs/modal-post-comment";
import {ModalImageViewer} from "../../../pages/dialogs/modal-image-viewer";
import {ServerErrorService} from "../../../shared/server.error.service";

import observable = require("data/observable");
require("nativescript-dom");
let view = require("ui/core/view"); 
let app = require("application");
let cameraModule = require("camera");
let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let enums = require("ui/enums");
let imagepicker = require("nativescript-imagepicker");
let nstoasts = require("nativescript-toasts");
declare var android: any;

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-dashboard.css'],
    templateUrl: './kid-dashboard.html',
    providers: [PostService, ModalDialogService, ServerErrorService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KidDashboardComponent implements OnInit {
    public kid: any;
    public comments: Array<Comment>;
    public tagged_to: Array<TaggedTo>;
    public topmost;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public selectedImages = [];
    public showActionBarItems: Boolean = false;
    public lastModified: string = '';
    public postCount: number = 0;
    public loadOnDemandFired: Boolean = false;
    public isLoadingMore: Boolean = false;
    public showLoadingIndicator: Boolean = false;
    public loadMoreText: string = 'load more';
    public posts: any;
    public textOnlyBgColors: Array<any>;


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
        this.kid = this.kidData.info;
        this.textOnlyBgColors = ['#C46D21','#BE1C2F', '#FF3869', '#4195FF',
            '#A52BFF','#1E6587', '#32C4FC', '#FF2717','#FF601D', '#82AF52'];

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
        this.kid = this.kidData.info;
        this.isLoading = true;
        this.posts = [];
        this.getPosts(false);
    }


    getPosts(loadingMorePosts) {
        this.postService.getPosts(this.postCount, this.lastModified, this.kid.kid_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    body.posts.forEach(post => {
                        this.posts.push(this.addNewPostToListView(post));
                    });
                    this.postCount = body.post_count;
                    this.lastModified = body.last_modified;
                    if (loadingMorePosts) {
                        this.showLoadingIndicator = false;
                        this.loadMoreText = 'load more';
                        if (body.posts.length < 1) {
                            this.isLoadingMore = false;
                           /* nstoasts.show({
                                text: 'reached end of results',
                                duration: nstoasts.DURATION.SHORT
                            });*/
                        }
                    } else {
                        this.isLoadingMore = true;
                        if(body.posts.length < 1) {
                            this.isLoadingMore = false;
                        }
                    }
                    this.isLoading = false;
                    this.changeDetectorRef.markForCheck();
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    loadMore() {
        this.kid = this.kidData.info;
        this.isLoadingMore = true;
        this.showLoadingIndicator = true;
        this.loadMoreText = 'loading...';
        this.getPosts(true);
    }


    addNewPostToListView(post) {
        let newPost = new Post(post.kl_id, post.slug, post.title, post.new_title, post.tzone,
            post.scope, post.text, post.author_name, post.photograph,
            post.new_created_at, post.deletable,
            post.can_delete, post.can_edit, post.can_save, post.kid_birthdate,
            post.hearted, post.heart_icon, post.hearts_count, post.asset_base_url);
        // tags
        newPost.tags = post.tags;
        newPost.images = post.images;
        newPost.large_images = post.large_images;
        newPost.img_keys = post.img_keys;
        let isTextOnly = post.images[0] ? false : true;
        newPost.text_only =  isTextOnly;
        if(isTextOnly){
            newPost.text_only_bg = this.textOnlyBgColors[Math.floor((Math.random()*this.textOnlyBgColors.length))]
        }
        // add comments
        if (post.comments.length) {
            post.comments.forEach((comment) => {
                newPost.comments.push(new Comment(comment.commented_by, comment.slug, comment.created_at, comment.child_name,
                    comment.child_relationship, comment.commenter_photo, comment.content, comment.unknown_commenter))
            })
        } else {
            newPost.comments = []
        }
        // add tagged_to
        if (post.tagged_to.length) {
            post.tagged_to.forEach((tagged) => {
                newPost.tagged_to.push(new TaggedTo(tagged.kl_id, tagged.short_name, tagged.nickname,
                    tagged.photograph, tagged.fname, tagged.lname))
            })
        } else {
            newPost.tagged_to = [];
        }

        return newPost;
    }

    selectMomentCaptureOption() {
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Take photo", "Choose existing","Text only"]
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
            }else if(result === 'Text only'){

                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        "textOnly": true
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
            width: 400, height: 400, keepAspectRatio: true,
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
                        this.routerExtensions.navigate(["/kid-moment"], {
                            transition: {
                                name: 'slideUp'
                            }
                        });

                    }).catch((e) => {
                      //this.serverErrorService.showErrorModal();
                    //console.log("Error: " + e);
                    //console.log(e.stack);
                });
            }).catch((e) => {
              //this.serverErrorService.showErrorModal();
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

    addOrRemoveHeart(post, index) {
        let currentPostObject = post;
        let isHearted = currentPostObject.hearted;
        if (isHearted) {
            //already hearted so unheart it
            currentPostObject.hearted = false;
            currentPostObject.hearts_count--;
        } else {
            currentPostObject.hearted = true; //heart it

        }
        this.postService.addOrRemoveHeart(post, isHearted)
            .subscribe(
                (result) => {
                    let body = result.body;
                    // update currentPost with new data
                    currentPostObject.asset_base_url = body.asset_base_url;
                    currentPostObject.heart_icon = body.heart_icon;
                    currentPostObject.hearts_count = body.hearts_count;
                    nstoasts.show({
                        text: result.message,
                        duration: nstoasts.DURATION.SHORT
                    });
                    this.changeDetectorRef.markForCheck();
                },
                (error) => {
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
    selectPostActions(args, post, index) {
        let actions = [];

        if (post.can_edit) {
            //TODO enable after completing the editPostSection
            actions.push('Edit')
        }
        if (post.can_delete) {
            actions.push('Delete')
        }
        if (actions.length) {
            dialogs.action({
                //message: "",
                cancelButtonText: "Cancel",
                actions: actions
            }).then(result => {
                if (result === 'Delete') {
                    this.deletePost(post, index);
                } else if (result === 'Edit') {
                    this.editPost(post);
                }
            });
        }

    }

    editPost(post) {
        // save the post data in providers to available in next screen
        this.sharedData.currentPost = post;
        this.routerExtensions.navigate(["/kid-edit-moment"], {
            transition: {
                name: "slideLeft",
                duration: 300,
                curve: "easeInOut"
            }
        });
    }

    deletePost(post, index) {
        let postIndex = this.posts.indexOf(post);
        this.posts.splice(postIndex, 1);
        nstoasts.show({
            text: 'Post successfully deleted.',
            duration: nstoasts.DURATION.SHORT
        });
        this.changeDetectorRef.markForCheck();
        this.postService.deletePost(post)
            .subscribe(
                (result) => {
                },
                (error) => {
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
        //let postImages = post.large_images;
        let postImages = post.images;
        var options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                imageUrls: postImages
            },
            fullscreen: true
        };
        this.modal.showModal(ModalImageViewer, options).then((result) => {
            if (result === 'close' || typeof(result) == "undefined") {
                // modal closed
            } else {
            }
        })  
    }


    showModalCommentToPost(post, index) {
        var options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                post_kl_id: post.kl_id,
                post_slug: post.slug
            },
            fullscreen: false
        };
        // let currentPost = this.posts.getItem(index);
        let currentPost = post;
        if (currentPost) {
            this.modal.showModal(ModalPostComment, options).then((result) => {
                if (result === 'close' || typeof(result) == "undefined") {
                    // modal closed
                } else {
                    //TODO append commet detail to currentPost Object as Observable instead refreshing..
                    //console.log("Modal Comment Result " + JSON.stringify(result));/
                    currentPost.comments.push(new Comment(result.commented_by, result.slug, result.created_at, '',
                        '', result.commenter_photo, result.content, false));

                    // this.changeDetectorRef.detectChanges();
                    nstoasts.show({
                        text: 'Your comment added.',
                        duration: nstoasts.DURATION.SHORT
                    });
                    this.changeDetectorRef.markForCheck();
                }
            })
        }
    }

}