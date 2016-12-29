import { View } from "ui/core/view";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";

import { Teacher } from "../../shared/teacher/teacher";
import { TeacherService } from "../../shared/teacher/teacher.service";
import { Page } from "ui/page";

import * as appSettings from "application-settings"
import { TokenService } from "../../shared/token.service";
import { TeacherInfo } from "../../providers/data/teacher_info";

@Component({
    selector: "my-app",
    providers: [TeacherService],
    templateUrl: "pages/verify-password/password.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class VerifyPasswordPage implements OnInit {
    teacher: Teacher;
    public email: string;
    isAuthenticating = false;
    public isLoading: Boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
                private teacherService: TeacherService, private page: Page,
                private teacherInfo: TeacherInfo) {
        this.teacher = new Teacher();
        this.route.queryParams.subscribe(params => {
            this.teacher.email = params["email"];
        });
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        //this.page.backgroundImage = "res://bg_login";
    }


    signIn() {
        this.isAuthenticating = true;
        this.isLoading = true;
        //this.router.navigate(["calendar"]);
        this.teacherService.signIn(this.teacher)
            .subscribe(
                (result) => {
                    TokenService.authToken = result.body.auth_token;
                    var body = result.body;
                    this.teacherInfo.storage  = body;
                    // save teacher info in app-settings to invoke rest api's using season, room etc...
                    TeacherInfo.details = JSON.stringify(body);
                    console.log("SignIN Response: "+ JSON.stringify(result));
                    this.isLoading = false;
                    this.router.navigate(["calendar"]);
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    this.isLoading = false;
                    alert(error.message)
                }
            );
    }

    forgotPassword() {
        //TODO: to define
    }


}