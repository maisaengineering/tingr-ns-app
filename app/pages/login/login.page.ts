import { Router, NavigationExtras } from "@angular/router";
import { connectionType, getConnectionType } from "connectivity";
import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
import { Teacher } from "../../shared/teacher/teacher";
import { TeacherService } from "../../shared/teacher/teacher.service";

@Component({
    selector: "my-app",
    providers: [TeacherService],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginPage implements OnInit {
    teacher: Teacher;
    isLoggingIn = false;
    email = 'teacher1@org1.com';
    public isLoading: Boolean = false;

    ngOnInit() {
        this.page.actionBarHidden = true;
        /*if (getConnectionType() === connectionType.none) {
            alert("Tingr requires an internet connection to log in.");
            return;
        }*/
    }

    constructor(private router: Router, private teacherService: TeacherService, private page: Page) {
        this.teacher = new Teacher();
        this.teacher.email = "teacher1@org1.com";
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