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

    sendMessage(msg_text, kid_klid) {
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
                conversation_klid: "",
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
        console.log("ORg ID :" + room.organization_id);
        console.log("Teacher Info "+ JSON.stringify(room))

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

    getMessages() {
        let messages = [];
        let data1 = {
            "01/07/17": [
                {
                    text: "some message 1", sender_name: "John reo", photograph: "", child_name: "Jenny",
                    child_relationship: "Father", conversation_klid: "1",
                    created_at: "2017-01-15T03:29:15.692-05:00", read_message: false
                },
                {
                    text: "some message 2", sender_name: "John reo", photograph: "", child_name: "Jenny",
                    child_relationship: "Father", conversation_klid: "2",
                    created_at: "2017-01-15T03:29:15.692-05:00", read_message: false
                },
                {
                    text: "some message 3", sender_name: "John reo", photograph: "", child_name: "Jenny",
                    child_relationship: "Father", conversation_klid: "2",
                    created_at: "2017-01-15T03:29:15.692-05:00", read_message: false
                }
            ]

        };


        let data2 = {
            "01/08/17": [
                {
                    text: "some message 4", sender_name: "John reo", photograph: "", child_name: "Jenny",
                    child_relationship: "Father", conversation_klid: "1",
                    created_at: "2017-01-15T03:29:15.692-05:00", read_message: false
                },
                {
                    text: "some message 5", sender_name: "John reo", photograph: "", child_name: "Jenny",
                    child_relationship: "Father", conversation_klid: "2",
                    created_at: "2017-01-15T03:29:15.692-05:00", read_message: false
                },
                {
                    text: "some message 6", sender_name: "John reo", photograph: "", child_name: "Jenny",
                    child_relationship: "Father", conversation_klid: "2",
                    created_at: "2017-01-15T03:29:15.692-05:00", read_message: false
                }
            ]

        };

        messages.push(data1);
        messages.push(data2);
        return messages;
    }

    handleErrors(error: any) {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error);
    }
}
