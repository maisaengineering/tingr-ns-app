import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Teacher } from "./teacher";
import { Config } from "../config";
//import * as appSettings from "application-settings"
import { TokenService } from "../token.service";
import { TeacherInfo } from "../../providers/data/teacher_info";

@Injectable()
export class TeacherService {
    constructor(private http: Http,private teacherInfo: TeacherInfo) {}

    signIn(teacher: Teacher) {
        console.log("signIn accessToken:" + TokenService.accessToken);
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
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
        .catch(this.handleErrors);
    }


    logoff() {
        TokenService.authToken = "";
    }

    evaluteUser(teacher: Teacher) {
        console.log("evaluser accessToken:" + TokenService.accessToken);
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
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