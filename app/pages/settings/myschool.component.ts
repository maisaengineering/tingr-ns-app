import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import { RouterExtensions } from 'nativescript-angular/router';
import { TeacherService } from "../../shared/teacher/teacher.service";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";

let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'settings-page',
    templateUrl: './myschool.html',
    styleUrls: ["./settings.css"],
    providers: [ TeacherService, ServerErrorService ]
})
export class MySchoolComponent implements OnInit{
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public mySchoolUrl: string;

    constructor(private location: Location,
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
    }

    ngOnInit(){
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.getSchoolInfo();

    }

    getSchoolInfo(){
        this.isLoading = true;
        this.teacherService.mySchoolInfo()
            .subscribe(
                (result) => {
                    this.mySchoolUrl = result.body.url;
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }



}
