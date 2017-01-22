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


    handleErrors(error: any)  {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }


}