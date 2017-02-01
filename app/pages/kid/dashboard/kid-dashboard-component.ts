import {Component, ViewContainerRef, ChangeDetectorRef, OnInit, ViewChild, ElementRef} from "@angular/core";
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

import {ObservableArray} from "data/observable-array";
import observable = require("data/observable");

require("nativescript-dom");
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
import {
    ListViewLinearLayout,
    ListViewEventData,
    RadListView,
    ListViewLoadOnDemandMode
}from "nativescript-telerik-ui/listview";
import * as timerModule  from "timer";
import {StackLayout} from "ui/layouts/stack-layout";

import listViewModule = require("nativescript-telerik-ui/listview");
import listViewAnularModule = require("nativescript-telerik-ui/listview/angular");
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


    public comments: Array<Comment>;
    public tagged_to: Array<TaggedTo>;
    public topmost;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public selectedImages = [];
    public showActionBarItems: Boolean = false;
    private numberOfAddedItems; // pull to refresh
    public lastModified: string = '';
    public postCount: number = 0;

    private posts: ObservableArray<Post>;
    private _layout: ListViewLinearLayout;


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

        this.layout = new ListViewLinearLayout();
        this.getPosts();
        this.changeDetectorRef.detectChanges();
    }

    public get layout(): ListViewLinearLayout {
        return this._layout;
    }
    public set layout(value: ListViewLinearLayout) {
        this._layout = value;
    }


    public onLoadMoreItemsRequested(args: ListViewEventData) {
        var that = new WeakRef(this);
        timerModule.setTimeout(() => {
            let listView: RadListView = <RadListView>(frameModule.topmost().currentPage.getViewById("listView"));
            let initialItemsCount = this.posts.length;
            console.log("Number "+ initialItemsCount)
            let initialNumberOfItems = that.get().numberOfAddedItems;
            this.postService.getPosts(this.postCount, this.lastModified, this.kid.kid_klid)
                .subscribe(
                    (result) => {
                        var body = result.body;
                        // set postCount and lastModified to get more data on scroll(pagination)
                        this.postCount = body.post_count;
                        this.lastModified = body.last_modified;
                        if (body.posts.length) {
                            body.posts.forEach((post) => {
                                this.addNewPostToListView(post);
                                that.get().numberOfAddedItems++;
                            });
                        } else {
                            listView.loadOnDemandMode = ListViewLoadOnDemandMode[ListViewLoadOnDemandMode.None];
                        }
                        listView.notifyLoadOnDemandFinished();
                        args.returnValue = true;
                        listView.scrollToIndex(initialItemsCount - 1);
                    },
                    (error) => {
                        this.isLoading = false;
                        listView.notifyLoadOnDemandFinished();
                        this.serverErrorService.showErrorModal();
                    }
                );

        }, 1000);

    }

    getPosts(commentedOnPost = false) {
        this.isLoading = true;
        this.posts = new ObservableArray<Post>();
        this.numberOfAddedItems = 0;
        this.postService.getPosts(this.postCount, this.lastModified, this.kid.kid_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    console.log("Posts " + JSON.stringify(body.posts));
                    // set postCount and lastModified to get more data on scroll(pagination)
                    this.postCount = body.post_count;
                    this.lastModified = body.last_modified;
                    //this.posts = body.posts;
                    body.posts.forEach((post) => {
                        this.addNewPostToListView(post);
                        this.numberOfAddedItems++;
                    });

                    this.isLoading = false;
                    if (commentedOnPost) {
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

    addNewPostToListView(post) {
        let newPost = new Post(post.kl_id, post.slug, post.title, post.tzone,
            post.scope, post.text, post.author_name, post.photograph,
            post.image, post.large_image, post.created_at, post.deletable,
            post.can_delete, post.can_edit, post.can_save, post.kid_birthdate,
            post.hearted, post.heart_icon, post.hearts_count, post.asset_base_url);
        // tags
        newPost.tags = post.tags;
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

        this.posts.push(newPost);
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
        this.routerExtensions.backToPreviousPage();
        /*this.routerExtensions.navigate(["/myclass"], {
            transition: {
                name: "slideRight"
            }
        });*/
    }

    addOrRemoveHeart(post, index) {
         console.log("Index "+ index);
        let currentPostObject = this.posts.getItem(index);
        let isHearted = currentPostObject.hearted;
        if(isHearted){
            //already hearted so unheart it
            currentPostObject.hearted = false;
            currentPostObject.hearts_count -=  1
        }else {
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
    selectPostActions(post, index) {
        let actions = [];
        if (post.can_edit) {
            //TODO enable after completing the editPostSection
            actions.push('Edit')
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
                this.deletePost(post, index);
            } else if (result === 'Edit') {
                this.editPost(post);
            }

        });
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
       // let currentPost = this.posts.filter(p => p.kl_id === post.kl_id)[0];
        //let index = this.posts.indexOf(currentPost);
        let currentPostObject = this.posts.getItem(index);
        // send request in background
        /*this.postService.deletePost(currentPost)
            .subscribe(
                (result) => { },
                (error) => {
                    console.error("Error deleting post "+ JSON.stringify(error));
                }
            );*/

        // delete item from stack
        this.posts.splice(this.posts.indexOf(currentPostObject), 1);
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


    showModalCommentToPost(post, index) {
        var options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                post_kl_id: post.kl_id,
                post_slug: post.slug
            },
            fullscreen: false
        };

        this.modal.showModal(ModalPostComment, options).then((result) => {
            if (result === 'close' || typeof(result) == "undefined") {
                // modal closed
                // console.log('Modal closed');
            } else {
                //TODO append commet detail to currentPost Object as Observable instead refreshing..
                //console.log("Modal Comment Result " + JSON.stringify(result));/
                this.postCount = 0;
                this.lastModified = '';
                this.getPosts(true);
            }

        })
    }

}