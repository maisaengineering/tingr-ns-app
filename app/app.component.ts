import {Component, OnInit} from "@angular/core";
import { AuthService } from "./shared/oauth/auth.service";
import { AuthData } from "./providers/data/oauth_data";
// Store oAuth access_token and user auth_token application-settings
var appSettings = require("application-settings");

@Component({
    selector: 'app',
    template: '<page-router-outlet></page-router-outlet>',
    providers: [AuthService],
})
export class AppComponent implements OnInit{
    constructor(private authService: AuthService, private authData: AuthData) { }

    ngOnInit() {
        /*     TODO: move the logic to application launchEvent
         http://docs.nativescript.org/angular/core-concepts/application-lifecycle
         get access_token if not yet or expired
         TODO : check against access_token expiry also
         appSettings.remove("accessToken");
         appSettings.clear();
         console.log("accessTokenOuter: " +appSettings.getString("acccessToken"));*/
        // appSettings.clear();
        //appSettings.setString("accessToken", "664ad1d476dce67606c3c1fc7cb00388f9c0387ba7aa6ae63b36231eccceeabf")
        if(typeof appSettings["accessToken"] === 'undefined'){
            this.authService.getClientToken()
                .subscribe(
                    (result) => {
                        // save accessToken in appSettings and authData
                        appSettings.setString("accessToken", result.access_token);
                        appSettings.setNumber("accessTokenExpiry", result.expires_in);
                        this.authData.storage = result;
                        console.log("TOKEN:"+appSettings.getString("accessToken"));
                    },
                    (error) => {
                        console.log('AppComponent-Error: '+ JSON.stringify(error))
                    }
                );
        }
    }

}
