import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./forms-and-docs.css'],
    templateUrl: './webview.html',
    providers: [  ]
})
export class FormOrDocWebviewComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public formOrDoc: any;
    public displayActionBar: Boolean = false;

    constructor(private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.kid = {};
        this.kid = this.kidData.info;
        this.formOrDoc = this.sharedData.formOrDoc;

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.isLoading = false;
        // show actionBar after some time
        setTimeout(() => {
            this.displayActionBar = true;
            this.isLoading = false;
        }, 500);
    }


    goBack(){
        this.routerExtensions.backToPreviousPage();
    }



}