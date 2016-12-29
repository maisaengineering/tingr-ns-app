import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {Page} from "../page";
import * as appSettings from "application-settings"
import { TokenService } from "../../shared/token.service";
import { TeacherInfo } from "../../providers/data/teacher_info";
var nstoasts = require("nativescript-toasts");

@Component({
    selector: 'my-app',
    templateUrl: 'pages/login/login.html'
})
export class LogoutComponent  implements OnInit {

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        // clear teacher authToken and details
        TokenService.authToken = '';
        TeacherInfo.details = '';
        //appSettings.clear();
        //TODO invoke logout API
        var options = {
            text: 'Logged out successfully',
            duration : nstoasts.DURATION.SHORT
        };
        nstoasts.show(options);
        // redirect to login page
        this.router.navigate(["login"]);
    }
}
