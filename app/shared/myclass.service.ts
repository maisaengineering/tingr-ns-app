import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { TeacherInfo } from "../providers/data/teacher_info";

@Injectable()
export class MyClassService {

    constructor(private http: Http) {

    }

    getManagedKids(room) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "managed_kids",
            body: {
                session_id: room.session_id,
                season_id: room.season_id
            }
        });

        return this.http.post(
            Config.apiUrl + "teachers", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: any)  {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }
}

export interface Room {
    name: string
}

export interface ManagedKid {
    fname: string,
    lname: string,
    age: number,
    reminders_count: number,
    notifications_count: number,
    kid_klid: string,
    photograph_url: string,
    in_or_out_time: string
}