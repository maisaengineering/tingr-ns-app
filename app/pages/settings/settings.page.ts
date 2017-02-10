import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
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
    selector: 'settings-page',
    templateUrl: './settings.page.html',
    styleUrls: ["./settings.css"],
    providers: [ TeacherService, ServerErrorService ]
})
export class SettingsPage implements OnInit{
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public showActionBarItems: Boolean = false;

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService,
                private router: Router) {

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
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
       // this.routerExtensions.backToPreviousPage();
        this.routerExtensions.navigate(["/calendar"], {
            transition: {
                name: "slideBottom"
            }
        });
    }

    getTour(){
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "fromSettingsPage": true
            }
        };
        this.router.navigate(["tour"], navigationExtras);
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
                            name: "slideBottom"
                        },
                        clearHistory: true
                    });

                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }
}
