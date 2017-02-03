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
import {Location} from "@angular/common";
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
import {Observable} from "rxjs/Rx";

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
    public loadOnDemandFired: Boolean = false;

    //private posts: ObservableArray<Post>;
    private _layout: ListViewLinearLayout;

    public posts: ObservableArray<Post>;


    constructor(private postService: PostService,
                private modal: ModalDialogService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService,
                private location: Location) {
        //super(changeDetectorRef);

        this.kid = {};
        this.kid = kidData.info;

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    @ViewChild('myRadListView') listViewComponent: listViewAnularModule.RadListViewComponent;

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
        this.isLoading = true;
        this.posts = new ObservableArray<Post>();
        this.postService.getPosts(this.postCount, this.lastModified, this.kid.kid_klid)
            .map((response1) => {
                let result: Array<any> = [];
                let res = response1.json();
                // console.log("response " + JSON.stringify(response1.json()));
                res.body.posts.forEach(post => {
                    this.posts.push(this.addNewPostToListView(post));
                });
                this.postCount = res.body.post_count;
                this.lastModified = res.body.last_modified;
                return result;
            })
            .subscribe(
                data => {
                    console.log("postCount " + this.postCount);
                    console.log("lastModified " + this.lastModified);
                    this.isLoading = false;
                },
                error => {
                    this.isLoading = false;
                }
            );
        this.changeDetectorRef.detectChanges();
    }

    public onLoadMoreItemsRequested(args: ListViewEventData) {
        var that = new WeakRef(this);
        timerModule.setTimeout(() => {
            //  let listView: RadListView = <RadListView>(frameModule.topmost().currentPage.getViewById("myRadListView"));
            //let listView: RadListView = args.object;
            let listView: listViewModule.RadListView = args.object;
            let initialNumberOfItems = that.get().numberOfAddedItems;
            //let oldItems = that.get().posts;
            that.get().postService.getPosts(that.get().postCount, that.get().lastModified, that.get().kid.kid_klid)
                .map((response1) => {
                    let result: Array<any> = [];
                    let res = response1.json();
                    let newlyAdded = 0;
                    // console.log("response " + JSON.stringify(response1.json()));
                    res.body.posts.forEach(post => {
                        that.get().posts.push(that.get().addNewPostToListView(post));
                        newlyAdded++
                    });
                    if (res.body.posts.length > 0) {

                    } else {
                        listView.loadOnDemandMode = ListViewLoadOnDemandMode[ListViewLoadOnDemandMode.None];
                    }
                    return res;

                })
                .subscribe(
                    res => {
                        that.get().loadOnDemandFired = true;
                        that.get().postCount = res.body.post_count;
                        that.get().lastModified = res.body.last_modified;
                    },
                    error => {
                        this.isLoading = false;
                    }
                );
            listView.notifyLoadOnDemandFinished();
        }, 1000);

        return args.returnValue = true;

    }


    public get layout(): ListViewLinearLayout {
        return this._layout;
    }

    public set layout(value: ListViewLinearLayout) {
        this._layout = value;
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

        return newPost;
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

    addOrRemoveHeart(post, index) {
        let currentPostObject = this.posts.getItem(index);
        let isHearted = currentPostObject.hearted;
        if (isHearted) {
            //already hearted so unheart it
            currentPostObject.hearted = false;
            currentPostObject.hearts_count -= 1
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
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: actions
        }).then(result => {
            if (result === 'Delete') {
                this.deletePost(args, post, index);
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

    deletePost(args: ListViewEventData, post, index) {
        // check for fix: https://github.com/telerik/nativescript-ui-samples-angular/issues/35
        var listView: RadListView = args.object;
        console.log("args.object.bindingContext "+ index);
        //let currentPost = this.posts.filter(p => p.kl_id === post.kl_id)[0];
        let currentPostObject = this.posts.getItem(index);
        try {
            if(this.isAndroid){
                this.posts.splice(this.posts.indexOf(currentPostObject), 1);
            }
        }
        catch(err) {
           console.log("unable to delete item")
        }
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
        let currentPost = this.posts.getItem(index);
        if(currentPost){
            this.modal.showModal(ModalPostComment, options).then((result) => {
                if (result === 'close' || typeof(result) == "undefined") {
                    // modal closed
                    // console.log('Modal closed');
                } else {
                    //TODO append commet detail to currentPost Object as Observable instead refreshing..
                    //console.log("Modal Comment Result " + JSON.stringify(result));/

                    currentPost.comments.push(new Comment(result.commented_by, result.slug, result.created_at, '',
                        '', result.commenter_photo, result.content, false))
                }

            })
        }


    }
}