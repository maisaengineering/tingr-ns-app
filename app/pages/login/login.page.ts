import {Component, ViewContainerRef, OnInit, ViewChild, ElementRef, Injectable} from "@angular/core";
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {Page} from "ui/page";
import {Teacher} from "../../shared/teacher/teacher";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {TokenService} from "../../shared/token.service";
import {AuthService} from "../../shared/oauth/auth.service";
import {SharedData} from "../../providers/data/shared_data"
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import {Label} from "ui/label";
var app = require("application");
var view = require("ui/core/view");

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [TeacherService, AuthService, ServerErrorService],
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
    public emailError: Boolean = false;
    /* public emailTextField = view.getViewById(this.page, "email");*/

    //@ViewChild("formErrors") formErrorsRef: ElementRef;


    constructor(private authService: AuthService, private router: Router,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService, private page: Page,
                private sharedData: SharedData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
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
        //this.page.backgroundImage = '~/images/teacher-login-bg.png';
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
                        this.serverErrorService.showErrorModal();
                    }
                );
        }
    }


    submitEmail() {
        //let labelError = <Label>this.formErrorsRef.nativeElement;
        let emailTextField = view.getViewById(this.page, "email");

        //dismiss input
        if (emailTextField.ios) {
            emailTextField.ios.endEditing(true);
        } else if (emailTextField.android) {
            emailTextField.android.clearFocus();
        }

        if (this.email === '') {
            this.emailError = true;
            emailTextField.borderColor = '#e89999';
            return;
        }

        this.isLoading = true;
        this.teacher.email = this.email;
        this.sharedData.email = this.teacher.email; // use this provider in next page get the value

        this.teacherService.evaluteUser(this.teacher)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    emailTextField.borderColor = '#b7d6a9';
                    // save user auth_token and info in appSettings
                    if (result.body.goto === 'signup') {
                        this.emailError = true;
                        emailTextField.borderColor = '#e89999';
                        alert(result.body.teacher_error);
                    } else {
                        this.routerExtensions.navigate(["/verify-password"], {
                            transition: {
                                name: "flip",
                                duration: 500
                            },
                        });
                    }
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }


}