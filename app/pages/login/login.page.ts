import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {Component, OnInit, ViewChild, ElementRef, Injectable} from "@angular/core";
import {Page} from "ui/page";
import {Teacher} from "../../shared/teacher/teacher";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {TokenService} from "../../shared/token.service";
import {AuthService} from "../../shared/oauth/auth.service";
import {SharedData} from "../../providers/data/shared_data"
import {InternetService} from "../../shared/internet.service";
import {Label} from "ui/label";
var app = require("application");
var view = require("ui/core/view");

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [TeacherService, AuthService],
    templateUrl: "./login.html",
    styleUrls: ["./login-common.css", "./login.css"]
})

export class LoginPage implements OnInit {
    teacher: Teacher;
    isLoggingIn = false;
    email = 'teacher1@org1.com';
    //email = '';
    isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;


    @ViewChild("formErrors") formErrorsRef: ElementRef;


    constructor(private authService: AuthService, private router: Router,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService, private page: Page,
                private sharedData: SharedData,
                private internetService: InternetService) {
        this.teacher = new Teacher();
        this.teacher.email = this.email;
        this.teacher.email = "";
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
        /*if (getConnectionType() === connectionType.none) {
         alert("Tingr requires an internet connection to log in.");
         return;
         }*/

        // focus on email field
        let emailTextField = view.getViewById(this.page, "email");
        //emailTextField.focus();

        // get AccessToken
        if (!!TokenService.accessToken === false) {
            this.isLoading = true;
            this.authService.getAccessToken()
                .subscribe(
                    (result) => {
                        // save accessToken in appSettings and authData
                        TokenService.accessToken = result.access_token;
                        TokenService.accessTokenExpiry = result.expires_in;
                        this.isLoading = false;
                    },
                    (error) => {
                        this.isLoading = false;
                        alert('Internal server error.');
                    }
                );
        }
    }


    submitEmail() {
        let labelError = <Label>this.formErrorsRef.nativeElement;
        if (this.email === '') {
            labelError.text = "Email can't be blank";
            return;
        } else {
            labelError.text = "";
        }

        this.isLoading = true;
        this.teacher.email = this.email;
        this.sharedData.email = this.teacher.email; // use this provider in next page get the value
        this.teacherService.evaluteUser(this.teacher)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    // save user auth_token and info in appSettings
                    if (result.body.goto === 'signup') {
                        alert("Email does not exists")
                    } else {
                        this.routerExtensions.navigate(["/verify-password"], {
                            transition: {
                                name: "flip",
                                duration: 700
                            },
                        });
                    }

                },
                (error) => {
                    this.isLoading = false;
                    //alert('Internal server error.');
                    console.log("Login ERROR: " + JSON.stringify(error));
                }
            );
    }


}