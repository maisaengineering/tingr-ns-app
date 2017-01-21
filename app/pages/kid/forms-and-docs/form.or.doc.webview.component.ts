import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');
let app = require("application");
let utilityModule = require("utils/utils");


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
    public showActionBarItems: Boolean = false;

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
        // show actionBarItems after some time to fix overlappingg issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);
    }

    openShareOptions(formOrDoc){
        dialogs.action({
            message: "",
            cancelButtonText: "Cancel",
            actions: ["Request", "Print"]
        }).then((result) => {
            if(result === 'Print'){
                // open url in browser
                utilityModule.openUrl(formOrDoc.url);
            }
        });

    }


    goBack(){
        this.routerExtensions.backToPreviousPage();
    }



}