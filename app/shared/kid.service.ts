import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { Observable } from "rxjs/Rx";
@Injectable()
export class KidService {
    constructor(private http: Http) {
    }

    getProfileDetails(kid_klid) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "kid_info",
            body: {
                kid_klid: kid_klid
            }
        });
        return this.http.post(
            Config.apiUrl + "teachers", data, {
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