import {View} from "ui/core/view";
import {Router, ActivatedRoute} from "@angular/router";
import {Component, OnInit, ViewChild,} from "@angular/core";
import {RouterExtensions} from 'nativescript-angular/router';

import {Teacher} from "../../shared/teacher/teacher";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {Page} from "ui/page";

import * as appSettings from "application-settings"
import {TokenService} from "../../shared/token.service";
import {TeacherInfo} from "../../providers/data/teacher_info";
import {SharedData} from "../../providers/data/shared_data"
var app = require("application");
var view = require("ui/core/view");

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [TeacherService],
    templateUrl: "./password.html",
    styleUrls: ["../login/login-common.css", "../login/login.css"]
})
export class VerifyPasswordPage implements OnInit {
    teacher: Teacher;
    public email: string;
    isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public emailError: Boolean = false;
    public emailOrPasswordError: Boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService, private page: Page,
                private teacherInfo: TeacherInfo,
                private sharedData: SharedData) {
        this.teacher = new Teacher();
        this.isLoading = false;
        this.teacher.email = sharedData.email; // get the value from previous page through provider
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
       // let passTextField = view.getViewById(this.page, "password");
        //passTextField.focus();
    }


    signIn() {
        // validate form
        let emailTextField = view.getViewById(this.page, "email");
        let passTextField = view.getViewById(this.page, "password");
        if (emailTextField.text === "" ) {
            emailTextField.borderColor = '#e89999';
            return;
        } else if (passTextField.text === ""){
            passTextField.borderColor = '#e89999';
            return;
        }


        this.isLoading = true;
        //this.router.navigate(["calendar"]);
        this.teacherService.signIn(this.teacher)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    emailTextField.borderColor = '#b7d6a9';
                    passTextField.borderColor = '#b7d6a9';
                    TokenService.authToken = result.body.auth_token;
                    var body = result.body;
                    this.teacherInfo.storage = body;
                    // save teacher info in app-settings to invoke rest api's using season, room etc...
                    TeacherInfo.details = JSON.stringify(body);
                    // save currentRoom details in apllication Data
                    // by default assuming first room
                    let room = TeacherInfo.parsedDetails.rooms[0];
                    TeacherInfo.currentRoom = JSON.stringify(room);
                    // to get the currentRoom => TeacherInfo.parsedCurrentRoom
                    this.routerExtensions.navigate(["/calendar"],
                        {
                            transition: {name: "slideLeft"},
                            clearHistory: true
                        });
                },
                (error) => {
                    this.emailOrPasswordError = true;
                    this.isLoading = false;
                    alert(error.message);
                    emailTextField.borderColor = '#e89999';
                    passTextField.borderColor = '#e89999';
                }
            );
    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }


}