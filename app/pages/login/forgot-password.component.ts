import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {Component, OnInit } from "@angular/core";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {Page} from "ui/page";
import {Location} from "@angular/common";
import {TokenService} from "../../shared/token.service";
import {TeacherInfo} from "../../providers/data/teacher_info";
import dialogs = require("ui/dialogs");
var view = require("ui/core/view");
var app = require("application");


@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [TeacherService],
    templateUrl: "./forgot-password.html",
    styleUrls: ["./login-common.css", "./login.css"]
})
export class ForgotPasswordComponent implements OnInit {
    public email: string;
    isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;


    constructor(private router: Router, private route: ActivatedRoute,
                private teacherService: TeacherService,
                private page: Page,private location: Location,
                private teacherInfo: TeacherInfo,
                private routerExtensions: RouterExtensions) {

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        //this.page.actionBarHidden = true;
        // focus on password field
        let passTextField = view.getViewById(this.page, "email");
        passTextField.focus();
    }

    goBack(): void {
       // this.location.back();
        this.routerExtensions.navigate(["/verify-password"], {
            transition: {
                name: "slideRight"
            }
        });
    }

    sendEmail() {
        let errorLabel = view.getViewById(this.page, "form-errors");
        let emailTextField = view.getViewById(this.page, "email");
        if (emailTextField.text === "") {
            errorLabel.text = "Email can't be blank";
            return;
        } else {
            errorLabel.text = "";
        }
        this.isLoading = true;

        this.teacherService.forgotPassword(this.email)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    dialogs.confirm({
                        title: "Info",
                        message: result.message,
                        okButtonText: "Ok",
                        cancelButtonText: "Login"
                    }).then(result => {
                        if(result === false) {
                            this.routerExtensions.navigate(["/login"], {
                                transition: {
                                    name: "slideRight"
                                },
                            });
                        }
                    });
                },
                (error) => {
                    this.isLoading = false;
                    //console.log("Error:  "+JSON.stringify(error));
                    dialogs.alert({
                        //title: "Error",
                        message: error.message,
                        okButtonText: "Ok"
                    }).then(function () {
                        //console.log("Dialog closed!");
                    });
                }
            );
    }



}