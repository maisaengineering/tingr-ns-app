import { Router, NavigationExtras } from "@angular/router";
import { connectionType, getConnectionType } from "connectivity";
import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
import { Teacher } from "../../shared/teacher/teacher";
import { TeacherService } from "../../shared/teacher/teacher.service";
import { TokenService } from "../../shared/token.service";
import { AuthService } from "../../shared/oauth/auth.service";
import {  getString } from "application-settings";

@Component({
    selector: "my-app",
    providers: [TeacherService, AuthService],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})

export class LoginPage implements OnInit {
    teacher: Teacher;
    isLoggingIn = false;
    email = 'teacher1@org1.com';
    public isLoading: Boolean = false;

    constructor(private authService: AuthService,private router: Router, private teacherService: TeacherService, private page: Page) {
        this.teacher = new Teacher();
        this.teacher.email = "teacher1@org1.com";
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        /*if (getConnectionType() === connectionType.none) {
            alert("Tingr requires an internet connection to log in.");
            return;
        }*/
        // get AccessToken
        if(!!TokenService.accessToken === false){
            this.isLoading = true;
            this.authService.getAccessToken()
                .subscribe(
                    (result) => {
                        // save accessToken in appSettings and authData
                        TokenService.accessToken = result.access_token;
                        TokenService.accessTokenExpiry = result.expires_in;
                        console.log("New AccessTOKEN: "+getString("accessToken"));
                        this.isLoading = false;
                    },
                    (error) => {
                        console.log('AccessToken-Error: '+ JSON.stringify(error));
                        this.isLoading = false;
                    }
                );
        }
    }


    submitEmail() {
        this.isLoading = true;
        console.log('in submit mail');
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
                    console.log("evaluteUser Response: "+ JSON.stringify(result));
                    // save user auth_token and info in appSettings
                    if(result.body.goto === 'signup'){
                        alert("Email does not exists")
                    }else{
                        this.router.navigate(["/verify-password"], navigationExtras);
                    }
                    this.isLoading = false;
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(JSON.stringify(error));
                    this.isLoading = false;
                }
            );
    }


}