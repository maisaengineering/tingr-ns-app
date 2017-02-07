import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "../page";
import { RouterExtensions } from 'nativescript-angular/router';
import * as appSettings from "application-settings"
import { TokenService } from "../../shared/token.service";
import { TeacherInfo } from "../../providers/data/teacher_info";
import { TeacherService } from "../../shared/teacher/teacher.service";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";

let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'tour-page',
    templateUrl: './tour.html',
    styleUrls: ["./tour.css"],
    providers: [  ServerErrorService ]
})
export class TourComponent implements OnInit{
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public showActionBarItems: Boolean = false;

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private page: Page,
                private serverErrorService: ServerErrorService) {

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit(){
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.page.actionBarHidden = true;


    }

    skip(){
        this.routerExtensions.navigate(["/calendar"],
            {
                transition: {name: "slideLeft"},
                clearHistory: true
            });
    }



}
