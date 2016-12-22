import { View } from "ui/core/view";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";

import { Teacher } from "../../shared/teacher/teacher";
import { TeacherService } from "../../shared/teacher/teacher.service";
import { Page } from "ui/page";

import * as appSettings from "application-settings"


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

    constructor(private router: Router, private route: ActivatedRoute,
                private teacherService: TeacherService, private page: Page) {
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
        //this.router.navigate(["calendar"]);
        this.teacherService.signIn(this.teacher)
            .subscribe(
                (result) => {
                    console.log("SignIN Response: "+ JSON.stringify(result));
                    this.router.navigate(["calendar"]);

                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(error.message)
                }
            );
    }

    forgotPassword() {
        //TODO: to define
    }


}