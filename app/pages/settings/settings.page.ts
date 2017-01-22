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

var nstoasts = require("nativescript-toasts");


@Component({
    moduleId: module.id,
    selector: 'settings-page',
    templateUrl: './settings.page.html',
    styleUrls: ["./settings.css"],
    providers: [ TeacherService, ServerErrorService ]
})
export class SettingsPage extends Page implements OnInit{
    public isLoading: Boolean = false;
    public showActionBarItems: Boolean = false;

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        super(location);
    }

    ngOnInit(){
        // show alert if no internet connection
        this.internetService.alertIfOffline();

        // show actionBarItems after some time to fix overlappingg issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);
    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }


    logOut(){
        this.isLoading = true;
        this.teacherService.logOff()
            .subscribe(
                (result) => {
                    // clear teacher accessToke, authToken and details
                    TokenService.authToken = '';
                    TokenService.accessToken = '';
                    TeacherInfo.details = '';
                    appSettings.clear();
                    var options = {
                        text: 'Logged out successfully',
                        duration : nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                    this.isLoading = false;
                    // redirect to login page
                    this.routerExtensions.navigate(["/login"], {
                        transition: {
                            name: "slideTop"
                        }
                    });

                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }
}
