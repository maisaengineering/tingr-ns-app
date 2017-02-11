import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {RouterExtensions} from 'nativescript-angular/router';
import {TeacherService} from "../../shared/teacher/teacher.service";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import { TeacherInfo } from "../../providers/data/teacher_info";
import dialogs = require("ui/dialogs");
let view = require("ui/core/view");
let nstoasts = require("nativescript-toasts");
let app = require("application");


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './profile.html',
    styleUrls: ["./profile.css"],
    providers: [TeacherService, ServerErrorService]
})
export class TeacherProfileComponent implements OnInit {
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public teacherInfo: any;

    constructor(private page: Page, private location: Location,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        this.teacherInfo = TeacherInfo.parsedDetails;
    }

    ngOnInit() {
        // show alert if no internet connection
        console.log("Details "+ JSON.stringify(this.teacherInfo))
        this.internetService.alertIfOffline();
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

}
