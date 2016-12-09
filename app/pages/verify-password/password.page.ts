import { View } from "ui/core/view";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";

import { Teacher } from "../../shared/teacher/teacher";
import { TeacherService } from "../../shared/teacher/teacher.service";
import { Page } from "ui/page";
import { AuthData } from "../../providers/data/oauth_data";
var appSettings = require("application-settings");

@Component({
    selector: "my-app",
    providers: [TeacherService],
    templateUrl: "pages/verify-password/password.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class VerifyPasswordPage implements OnInit {
    teacher: Teacher;
    public email: string;

    ngOnInit() {
       this.page.actionBarHidden = true;
       //this.page.backgroundImage = "res://bg_login";
    }


    constructor(private router: Router, private route: ActivatedRoute,
                private teacherService: TeacherService, private page: Page,
                private authData: AuthData) {
        this.teacher = new Teacher();
        this.route.queryParams.subscribe(params => {
            this.teacher.email = params["email"];
        });
    }

    signIn() {
        this.teacherService.signIn(this.teacher)
            .subscribe(
                (result) => {
                    console.log("SignIn Response : "+ JSON.stringify(result));
                    // save user auth_token and info in appSettings
                    appSettings.setString("authToken", result.body.auth_token);
                    console.log("Before Data"+ JSON.stringify(this.authData.storage));
                    // add user info to authData to use in other components
                    var body = result.body;
                    this.authData.storage.auth_token = body.auth_token;
                    this.authData.storage.fname = body.fname;
                    this.authData.storage.lname = body.lname;
                    this.authData.storage.email = body.email;
                    console.log("After Data"+ JSON.stringify(this.authData.storage));

                    this.router.navigate(["home"]);
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(error.message);
                }
            );
    }

    forgotPassword() {
        //TODO: to define
    }


}