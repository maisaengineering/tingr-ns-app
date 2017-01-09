import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "../page";
import { RouterExtensions } from 'nativescript-angular/router';
import * as appSettings from "application-settings"
import { TokenService } from "../../shared/token.service";
import { TeacherInfo } from "../../providers/data/teacher_info";
import { TeacherService } from "../../shared/teacher/teacher.service";

var nstoasts = require("nativescript-toasts");


@Component({
    selector: 'settings-page',
    templateUrl: 'pages/settings/settings.page.html',
    styleUrls: ["pages/settings/settings.css"],
    providers: [ TeacherService ]
})
export class SettingsPage extends Page {
    public isLoading: Boolean = false;

    constructor(private location: Location,private routerExtensions: RouterExtensions,
                private teacherService: TeacherService) {
        super(location);
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
                            name: "slideRight"
                        }
                    });

                },
                (error) => {
                    this.isLoading = false;
                    //alert('Internal server error.');
                }
            );
    }
}
