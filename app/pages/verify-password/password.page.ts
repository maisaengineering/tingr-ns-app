import {View} from "ui/core/view";
import {Router, ActivatedRoute} from "@angular/router";
import {Component, OnInit, ViewChild} from "@angular/core";

import {Teacher} from "../../shared/teacher/teacher";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {Page} from "ui/page";

import * as appSettings from "application-settings"
import {TokenService} from "../../shared/token.service";
import {TeacherInfo} from "../../providers/data/teacher_info";
import app = require("application");
var view = require("ui/core/view");

@Component({
    selector: "my-app",
    providers: [TeacherService],
    templateUrl: "pages/verify-password/password.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class VerifyPasswordPage implements OnInit {
    teacher: Teacher;
    public email: string;
    isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
                private teacherService: TeacherService, private page: Page,
                private teacherInfo: TeacherInfo) {
        this.teacher = new Teacher();
        this.isLoading = false;
        this.route.queryParams.subscribe(params => {
            this.teacher.email = params["email"];
        });
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        this.page.actionBarHidden = true;

        //this.page.backgroundImage = "res://bg_login";

        // focus on password field
        let passTextField = view.getViewById(this.page, "password");
        passTextField.focus();
    }


    signIn() {
        // validate form
        let errorLabel = view.getViewById(this.page, "form-errors");
        let emailTextField = view.getViewById(this.page, "email");
        let passTextField = view.getViewById(this.page, "password");
        if (emailTextField.text === "" || passTextField.text === "") {
            errorLabel.text = "All fields required";
            // animate error label with fading opacity
            /*errorLabel.text.animate({
             opacity: 1,
             duration: 1000
             });*/
            return;
        } else {
            errorLabel.text = "";
        }


        this.isLoading = true;
        //this.router.navigate(["calendar"]);
        this.teacherService.signIn(this.teacher)
            .subscribe(
                (result) => {
                    TokenService.authToken = result.body.auth_token;
                    var body = result.body;
                    this.teacherInfo.storage = body;
                    // save teacher info in app-settings to invoke rest api's using season, room etc...
                    TeacherInfo.details = JSON.stringify(body);
                    this.isLoading = false;
                    this.router.navigate(["calendar"]);
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }


}