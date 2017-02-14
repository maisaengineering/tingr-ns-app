import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {Config} from "../shared/config";
import {TokenService} from "../shared/token.service";
import {TeacherInfo} from "../providers/data/teacher_info";

@Injectable()
export class MessageService {
    constructor(private http: Http) {
    }

    sendMessage(msg_text, kid_klid, conversation_klid = '') {
        let room = TeacherInfo.parsedCurrentRoom;
        let teacherInfo = TeacherInfo.parsedDetails;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "send_message",
            body: {
                text: msg_text,
                kid_klid: kid_klid, // reciver
                sender_klid: teacherInfo.teacher_klid, //sender
                conversation_klid: conversation_klid,
                organization_id: room.organization_id,
                season_id: room.season_id,
                session_id: room.session_id
            }
        });

        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    // get messages kid associated for
    getList(kid_klid, conversation_klid = '', last_message_time = ''){
        let headers = new Headers();
        let room = TeacherInfo.parsedCurrentRoom;
        let teacherInfo = TeacherInfo.parsedDetails;
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "messages",
            body: {
                 conversation_klid : conversation_klid,
                 kid_klid: kid_klid,
                 organization_id: room.organization_id,
                 last_message_time: last_message_time
            }
        });
        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    makeMessagesRead(conversationId, unreadMessageIds){
        let headers = new Headers();
        let teacherInfo = TeacherInfo.parsedDetails;
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "read_message",
            body: {
                conversation_klid : conversationId,
                profile_klid: teacherInfo.teacher_klid,
                messages_klid: unreadMessageIds
            }
        });
        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: any) {
        return Observable.throw(error);
    }
}
