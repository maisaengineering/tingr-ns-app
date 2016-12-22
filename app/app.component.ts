import {Component, OnInit} from "@angular/core";
import { AuthService } from "./shared/oauth/auth.service";
// Store oAuth access_token and user auth_token application-settings
import {  getString } from "application-settings";
import { TokenService } from "./shared/token.service";
var appSettings = require("application-settings");

@Component({
    selector: 'app',
    template: '<page-router-outlet></page-router-outlet>',
    providers: [AuthService],
})
export class AppComponent implements OnInit{
    constructor(private authService: AuthService) { }

    ngOnInit() {
        //appSettings.clear(); clear all info
        if(!!TokenService.accessToken === false){
            this.authService.getAccessToken()
                .subscribe(
                    (result) => {
                        // save accessToken in appSettings and authData
                        TokenService.accessToken = result.access_token;
                        TokenService.accessTokenExpiry = result.expires_in;
                        console.log("accessTOKEN: "+getString("accessToken"));
                    },
                    (error) => {
                        console.log('AppComponent-Error: '+ JSON.stringify(error))
                    }
                );
        }
    }

}
