import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { TeacherInfo } from "../providers/data/teacher_info";

@Injectable()
export class MessageService {
    constructor(private http: Http) { }

    sendMessage(msg_text, kid_klid) {
        var room = TeacherInfo.parsedDetails.rooms[0];
        var techerInfo = TeacherInfo.parsedDetails;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "send_message",
            body: {
                    text: msg_text,
                    profile_klid: techerInfo.teacher_klid, //sender
                    conversation_klid: "",
                    kid_klids: [kid_klid], // reciver
                    parent_klids: [],
                    teacher_klids: [],
                    org_admin_klids: []
            }
        });

        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: any)  {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error);
    }
}
