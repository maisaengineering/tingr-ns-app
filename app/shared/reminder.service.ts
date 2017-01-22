import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { TeacherInfo } from "../providers/data/teacher_info";

@Injectable()
export class ReminderService {

    constructor(private http: Http) {

    }

    getList(kid_klid){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "list",
            body: {
                teacher_klid: TeacherInfo.parsedDetails.teacher_klid,
                kid_klid: kid_klid
            }
        });
        return this.http.post(
            Config.apiUrl + "reminders", data, {
                headers: headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }


    readOrUnread(read = false, reminder_klid){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: read ? "read_reminder" : "unread_reminder",
            body: {
                reminder_klid: reminder_klid
            }
        });
        return this.http.post(
            Config.apiUrl + "reminders", data, {
                headers: headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: any)  {
        return Observable.throw(error.message || error);
    }


}