import {Router, NavigationExtras} from "@angular/router";
import {connectionType, getConnectionType} from "connectivity";
import {Component, OnInit, ViewChild, ElementRef, Injectable} from "@angular/core";
import {Page} from "ui/page";
import {Teacher} from "../../shared/teacher/teacher";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {TokenService} from "../../shared/token.service";
import {AuthService} from "../../shared/oauth/auth.service";
import {getString} from "application-settings";
import {Label} from "ui/label";
import app = require("application");
var view = require("ui/core/view");


@Component({
    selector: "my-app",
    providers: [TeacherService, AuthService],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})

export class LoginPage implements OnInit {
    teacher: Teacher;
    isLoggingIn = false;
    //email = 'teacher1@org1.com';
    email = '';
    isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;


    @ViewChild("formErrors") formErrorsRef: ElementRef;


    constructor(private authService: AuthService, private router: Router, private teacherService: TeacherService, private page: Page) {
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
        this.page.actionBarHidden = true;
        /*if (getConnectionType() === connectionType.none) {
         alert("Tingr requires an internet connection to log in.");
         return;
         }*/

        // focus on email field
        let emailTextField = view.getViewById(this.page, "email");
        emailTextField.focus();

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
        // pass user provided email to next page using NavigationExtras via routing
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "email": this.teacher.email
            }
        };
        this.teacherService.evaluteUser(this.teacher)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    // save user auth_token and info in appSettings
                    if (result.body.goto === 'signup') {
                        alert("Email does not exists")
                    } else {
                        this.router.navigate(["/verify-password"], navigationExtras);
                    }

                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }


}