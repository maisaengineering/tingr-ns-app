import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import { Page } from "ui/page";

import { ManagedKid } from "../../shared/myclass.service";
import { PostService,  Post, TaggedTo, Comment} from "../../shared/post.service";

import frameModule = require("ui/frame");
import { Router, NavigationExtras } from "@angular/router";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { KidData } from "../../providers/data/kid_data";
import {InternetService} from "../../shared/internet.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");


export class DataItem {
    constructor(public itemDesc: string) {}
}

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-dashboard.css'],
    templateUrl: './kid-dashboard.html',
    providers: [ PostService ]
})
export class KidDashboardComponent implements OnInit{
    public kid: any;
    public posts: Array<any>;
    public comments: Array<Comment>;
    public tagged_to: Array<TaggedTo>;
    public topmost;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(private postService: PostService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
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

    goBack(){
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
        let heartIconImage = view.getViewById(this.page, "post-add-remove-heart-"+post.kl_id);
        let heartedImage = view.getViewById(this.page, "post-hearted-image-"+post.kl_id);
        let activityIndicator = view.getViewById(this.page, "post-add-remove-heart-indicator-"+post.kl_id);
        let isHearted = heartIconImage.className === 'hearted' ? true : false
        this.isLoading = true;
        heartIconImage.visibility = 'collapsed';
        activityIndicator.visibility = 'visible';

        this.postService.addOrRemoveHeart(post,isHearted)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    let body = result.body;
                    if(isHearted){
                        // remove heart
                        heartIconImage.src = 'res://heart_icon_light';
                        heartIconImage.visibility = 'visible';
                        activityIndicator.visibility = 'collapsed';
                        heartIconImage.className = 'not-hearted';

                        heartedImage.floatOut('slow', 'left').then(function (){
                            heartedImage.visibility = "collapsed";
                        });
                    }else{
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

    openKidProfile(kid){
        this.routerExtensions.navigate(["/kid-profile"], {
            transition: {
               /* name: this.isIos ? 'curlUp' : 'explode',
                duration: 1000,
                curve: "linear"*/
               name: 'slideUp'
            }
        });
    }


}