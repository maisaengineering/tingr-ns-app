import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as appSettings from "application-settings"
import { TokenService } from "../../shared/token.service";
import { TeacherInfo } from "../../providers/data/teacher_info";
import { TeacherService } from "../../shared/teacher/teacher.service";

var nstoasts = require("nativescript-toasts");

@Component({
    selector: "my-app",
    providers: [TeacherService],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LogoutComponent  implements OnInit {
    public isLoading: Boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
                private teacherService: TeacherService) {
    }

    ngOnInit() {
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
                    this.router.navigate(["login"]);

                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }
}
