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


    // Uses Observable.forkJoin() to run multiple concurrent http.get() requests.
    // The entire operation will result in an error state if any single request fails.
    getRoomsAndMangedKids(room) {
        return Observable.forkJoin(
            this.getAssignedRooms(),
            this.getManagedKids(room),
        );
    }

    getAssignedRooms(){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "assigned_rooms",
            body: {
                teacher_klid: TeacherInfo.parsedDetails.teacher_klid
            }
        });

        return this.http.post(
            Config.apiUrl + "teachers", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
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
    }

    handleErrors(error: any)  {
        return Observable.throw(error.message || error);
    }
}

export interface Room {
    name: string
}

export interface ManagedKid {
    fname: string,
    lname: string,
    mname: string,
    age: number,
    reminders_count: number,
    notifications_count: number,
    kid_klid: string,
    photograph_url: string,
    in_or_out_time: string
}