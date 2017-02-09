import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {RouterExtensions} from 'nativescript-angular/router';
import * as appSettings from "application-settings"
import {TokenService} from "../../shared/token.service";
import {TeacherInfo} from "../../providers/data/teacher_info";
import {TeacherService} from "../../shared/teacher/teacher.service";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import dialogs = require("ui/dialogs");
let view = require("ui/core/view");
let nstoasts = require("nativescript-toasts");
let app = require("application");


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './change-password.html',
    styleUrls: ["./change-password.css"],
    providers: [TeacherService, ServerErrorService]
})
export class ChangePasswordComponent implements OnInit {
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public showActionBarItems: Boolean = false;

    public currentPassword: string = '';
    public newPassword: string = '';
    public confirmPassword: string = '';

    public currentPasswordError: Boolean = false;
    public newPasswordError: Boolean = false;
    public confirmPasswordError: Boolean = false;

    constructor(private page: Page, private location: Location,
                private routerExtensions: RouterExtensions,
                private teacherService: TeacherService,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    updatePassword() {
        // validate form
        let currentPassTextfield = view.getViewById(this.page, "currentPassword");
        let newPassTextfield = view.getViewById(this.page, "newPassword");
        let confirmPassTextfield = view.getViewById(this.page, "confirmPassword");
        currentPassTextfield.dismissSoftInput();
        newPassTextfield.dismissSoftInput();
        confirmPassTextfield.dismissSoftInput();


        let hasErrors = false;
        if(this.currentPassword === ''){
            this.currentPasswordError = true;
            hasErrors = true;
        }
        if(this.newPassword === ''){
            this.newPasswordError = true;
            hasErrors = true;
        }
        if(this.confirmPassword === ''){
            this.confirmPasswordError = true;
            hasErrors = true;
        }

        if(hasErrors){
            return;
        }else{
            this.isLoading = true;
            this.teacherService.updatePassword(this.currentPassword,this.newPassword,this.confirmPassword)
                .subscribe(
                    (result) => {
                        var options = {
                            text: result.message,
                            duration : nstoasts.DURATION.SHORT
                        };
                        nstoasts.show(options);
                        this.isLoading = false;
                        // redirect to settings page
                        /*this.routerExtensions.navigate(["/settings"], {
                            transition: {
                                name: "slideBottom"
                            }
                        });*/

                        this.routerExtensions.backToPreviousPage();
                    },
                    (error) => {
                        this.isLoading = false;
                        dialogs.alert({
                            title: "",
                            message: error.message,
                            okButtonText: "Ok"
                        }).then(()=> {

                        });
                    }
                );
        }

    }

}
