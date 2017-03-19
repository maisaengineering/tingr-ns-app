import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import {ServerErrorService} from "../../../shared/server.error.service";
import {FormsAndDocsService} from "../../../shared/forms.and.docs.service";
//let pdfview = require('nativescript-pdf-view');
let view = require("ui/core/view");
//let tnsfx = require('nativescript-effects');
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
    providers: [FormsAndDocsService, ServerErrorService]
})
export class FormOrDocWebviewComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public formOrDoc: any;
    public isPdfView: Boolean = false;

    constructor(private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private formsAndDocsService: FormsAndDocsService,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private vcRef: ViewContainerRef,
                private sharedData: SharedData,
                private internetService: InternetService,
                private serverErrorService: ServerErrorService) {
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
            if(this.isAndroid && this.formOrDoc.url_type && this.formOrDoc.url_type === '.pdf') {
                this.isPdfView = true;
            }

    }

    openShareOptions(formOrDoc) {
        dialogs.action({
            // message: "",
            cancelButtonText: "Cancel",
            actions: ["Request", "Print"]
        }).then((result) => {
            if (result === 'Print') {
                utilityModule.openUrl(formOrDoc.url); // open url in browser
            } else if (result === 'Request') {
                this.requestFormOrDoc(formOrDoc);
            } else {
                // dialog closed
            }
        });

    }

    requestFormOrDoc(formOrDoc) {
        this.isLoading = true;
        let kid_klid = this.kid.kid_klid;
        this.formsAndDocsService.requestFormOrDoc(formOrDoc, kid_klid)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    // show toast
                    nstoasts.show({
                        text: result.message,
                        duration: nstoasts.DURATION.SHORT
                    });
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }


    goBack() {
        this.routerExtensions.backToPreviousPage();
    }


}