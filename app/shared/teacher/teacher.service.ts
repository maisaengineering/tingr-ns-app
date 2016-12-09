import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Teacher } from "./teacher";
import { Config } from "../config";
import * as appSettings from "application-settings"
import { BackendService } from "../backend.service";
import { AuthData } from "../../providers/data/oauth_data";

@Injectable()
export class TeacherService {
    constructor(private http: Http,private authData: AuthData) {}

    signIn(teacher: Teacher) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: appSettings.getString("accessToken"),
            command: "authentication",
            body: {
                user_email: teacher.email,
                password: teacher.password,
                remember_me: true
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map(response => response.json())
            .do(result => {
                BackendService.token = result.access_token;
                appSettings.setString("authToken", result.body.auth_token);
                console.log("Before Data"+ JSON.stringify(this.authData.storage));
                // add user info to authData to use in other components
                var body = result.body;
                this.authData.storage.auth_token = body.auth_token;
                this.authData.storage.fname = body.fname;
                this.authData.storage.lname = body.lname;
                this.authData.storage.email = body.email;
                console.log("After Data"+ JSON.stringify(this.authData.storage));

            })
            .catch(this.handleErrors);
    }


    logoff() {
        BackendService.token = "";
    }

    evaluteUser(teacher: Teacher) {
        console.log("I am in service method now");
        console.log("Token:" + appSettings.getString("accessToken"));
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: appSettings.getString("accessToken"),
            command: "evaluate_user",
            body: {
                email: teacher.email
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        console.log("handleErrors:"+ JSON.stringify(error.json()));
        // return Observable.throw(error.json() || {error: 'Server error'})
        return Observable.throw(error.json() || {error: 'Server error'})
    }


}