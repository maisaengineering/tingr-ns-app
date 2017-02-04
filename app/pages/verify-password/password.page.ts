import {Component, ViewContainerRef, OnInit, ViewChild,} from "@angular/core";
import {View} from "ui/core/view";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from 'nativescript-angular/router';

import {Teacher} from "../../shared/teacher/teacher";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {Page} from "ui/page";

import * as appSettings from "application-settings"
import {TokenService} from "../../shared/token.service";
import {TeacherInfo} from "../../providers/data/teacher_info";
import {SharedData} from "../../providers/data/shared_data"
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import dialogs = require("ui/dialogs");
let app = require("application");
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [TeacherService, ServerErrorService],
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
    public passwordError: Boolean = false;
    public emailOrPasswordError: Boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService, private page: Page,
                private teacherInfo: TeacherInfo,
                private sharedData: SharedData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
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
        // show alert if no internet connection
        this.internetService.alertIfOffline();
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
        let forgotPassLink = view.getViewById(this.page, "forgotPassLink");
        if (emailTextField.text === "" ) {
            emailTextField.borderColor = '#e89999';
            this.emailError = true;
            return;
        } else if (passTextField.text === ""){
            passTextField.borderColor = '#e89999';
            this.passwordError = true;
            return;
        }

        emailTextField.borderColor = '#b7d6a9';
        passTextField.borderColor = '#b7d6a9';


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
                    this.isLoading = false;
                    dialogs.alert({
                        title: "",
                        message: error.message,
                        okButtonText: "Ok"
                    }).then(()=> {
                        emailTextField.borderColor = '#e89999';
                        passTextField.borderColor = '#e89999';
                        this.emailOrPasswordError = true;
                        forgotPassLink.floatIn('slow', 'top')
                    });
                }
            );
    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }


}