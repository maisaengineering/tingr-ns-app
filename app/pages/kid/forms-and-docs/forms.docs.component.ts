import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import { FormsAndDocsService } from "../../../shared/forms.and.docs.service";
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
    templateUrl: './forms-and-docs.html',
    providers: [ FormsAndDocsService ]
})
export class FormsAndDocumentsComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public formsAndDocs: Array<any>;

    constructor(private formsAndDocsService: FormsAndDocsService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.formsAndDocs = [];
        this.kid = {};
        this.kid = this.kidData.info;
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        // Hide 'Default Back button'
        if(this.isIos){
            var controller = frameModule.topmost().ios.controller;
            // get the view controller navigation item
            var navigationItem = controller.visibleViewController.navigationItem;
            // hide back button
            navigationItem.setHidesBackButtonAnimated(true, false);
        }

        this.getList();

    }

    getList(){
        this.formsAndDocs = this.formsAndDocsService.getList();
    }

    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.formsAndDocs = this.formsAndDocsService.getList();
        setTimeout(function () {
            pullRefresh.refreshing = false;
        }, 1000);
    }


    openFormOrDoc(formOrDoc){
        // share the data to next screen
        this.sharedData.formOrDoc = formOrDoc;
        this.routerExtensions.navigate(["/kid-form-or-doc-webview"], {
            transition: {
                name: "slideLeft",
                duration: 300,
                curve: "easeInOut"
            }
        });

    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }

}