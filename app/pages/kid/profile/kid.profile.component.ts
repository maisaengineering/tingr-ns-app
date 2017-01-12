import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {InternetService} from "../../../shared/internet.service";
import {KidService} from "../../../shared/kid.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-profile.css'],
    templateUrl: './kid-profile.html',
    providers: [KidService]
})
export class KidProfileComponent implements OnInit {
    public kid: any;
    public topmost;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(private kidService: KidService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private internetService: InternetService) {
        //super(changeDetectorRef);

        this.kid = {};
        this.kid = kidData.info;
        console.log("Kid Data : "+ JSON.stringify(this.kid));

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }

    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.isLoading = true;
        this.kidService.getProfileDetails(this.kid.kid_klid)
            .subscribe(
                (result) => {
                    this.kid =  result.body; // update kid info
                    this.isLoading = false;

                    // save details in provider
                    this.kidData.info = this.kid;
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }

    closeProfile(){
        this.routerExtensions.back();
    }

}