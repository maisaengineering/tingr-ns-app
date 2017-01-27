import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import {ServerErrorService} from "../../../shared/server.error.service";
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
    providers: [ FormsAndDocsService, ServerErrorService]
})
export class FormsAndDocumentsComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public forms: Array<any>;
    public documents: Array<any>;
    public showActionBarItems: Boolean = false;

    constructor(private formsAndDocsService: FormsAndDocsService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        //super(changeDetectorRef);
        this.forms = [];
        this.documents = [];
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

        // show actionBarItems after some time to fix overlappingg issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);

        this.getList();

    }

    getList(){
        this.isLoading = true;
        let kid_klid = this.kid.kid_klid;
        this.formsAndDocsService.getList(kid_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    console.log("Form& DOcs " + JSON.stringify(body))

                    this.forms = body.forms;
                    this.documents = body.documents;
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;

        let kid_klid = this.kid.kid_klid;
        this.formsAndDocsService.getList(kid_klid)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.forms = body.forms;
                    this.documents = body.documents;
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