import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { TeacherInfo } from "../providers/data/teacher_info";

@Injectable()
export class FormsAndDocsService {

    constructor(private http: Http) {

    }

    getList(kid_klid) {

        var room = TeacherInfo.parsedCurrentRoom;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "forms_and_documents",
            body: {
                session_id: room.session_id,
                season_id: room.season_id,
                kid_klid: kid_klid
            }
        });

        return this.http.post(
            Config.apiUrl + "organizations", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors);


    }

    requestFormOrDoc(formOrDoc, kid_klid){
        var room = TeacherInfo.parsedCurrentRoom;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "request_form_doc",
            body: {
                id: formOrDoc.id,
                type: formOrDoc.type,
                season_id: room.season_id,
                organization_id: room.organization_id,
                kid_klid: kid_klid
            }
        });

        return this.http.post(
            Config.apiUrl + "organizations", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors);
    }


    handleErrors(error: any)  {
        return Observable.throw(error.message || error);
    }


}