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
    styleUrls: ['./kid-documents.css'],
    templateUrl: './kid-documents.html',
    providers: [KidService]
})
export class KidDocumentsComponent implements OnInit {
    public kid: any;
    public topmost;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(private kidService: KidService,
                private page: Page,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private internetService: InternetService) {

        this.kid = {};
        this.kid = kidData.info;

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

    }

}