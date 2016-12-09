import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Teacher } from "./teacher";
import { Config } from "../config";
var appSettings = require('application-settings');

@Injectable()
export class TeacherService {
    constructor(private http: Http) {}

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
        .map((res:Response) => res.json())
        .catch(this.handleErrors);
    }


    handleErrors(error: Response) {
        console.log("handleErrors:"+ JSON.stringify(error.json()));
        
        return Observable.throw(error.json() || {error: 'Server error'})
    }


}