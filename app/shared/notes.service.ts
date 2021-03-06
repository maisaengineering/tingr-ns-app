import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { DatePipe } from '@angular/common';
import { TeacherInfo } from "../providers/data/teacher_info";

@Injectable()
export class NotesService {

    constructor(private http: Http, private datePipe: DatePipe) {

    }

    getList(kid_klid) {
        let room = TeacherInfo.parsedCurrentRoom;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "list",
            body: {
                kid_klid: kid_klid,
                organization_id: room.organization_id
            }
        });

        return this.http.post(
            Config.apiUrl + "notes", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors)


    }

    createNote(kid_klid,description){
        let room = TeacherInfo.parsedCurrentRoom;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "create",
            body: {
                kid_klid: kid_klid,
                description: description,
                organization_id: room.organization_id
            }
        });

        return this.http.post(
            Config.apiUrl + "notes", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors)
    }

    updateNote(note_kl_id, description){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "edit",
            body: {
                description: description
            }
        });

        return this.http.post(
            Config.apiUrl + "notes/"+note_kl_id, data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors)
    }

    deleteNote(note_kl_id){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "delete",
            body: {}
        });

        return this.http.post(
            Config.apiUrl + "notes/"+note_kl_id, data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors)
    }


    handleErrors(error: any)  {
        return Observable.throw(error.message || error);
    }


}