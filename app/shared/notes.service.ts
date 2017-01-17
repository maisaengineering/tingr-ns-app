import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { DatePipe } from '@angular/common';

@Injectable()
export class NotesService {

    constructor(private http: Http, private datePipe: DatePipe) {

    }

    getList(kid_klid) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "list",
            body: {
                kid_klid: kid_klid
            }
        });

        return this.http.post(
            Config.apiUrl + "notes", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors)


    }

    handleErrors(error: any)  {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }


}