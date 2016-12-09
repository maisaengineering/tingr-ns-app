import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../config";

@Injectable()
export class AuthService {
    constructor(private http: Http) {}

    getClientToken() {
        console.log('Hellow World...');
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this.http.post(
            Config.apiUrl + "clients/token",
            JSON.stringify({
                grant_type: "client_credentials",
                client_id: Config.clientId,
                client_secret: Config.clientSecret,
                scope: "KidsApp"
            }), {
                headers: headers
            }
        )
        .map((res:Response) => res.json())
        .catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        console.log("handleErrors:"+ JSON.stringify(error.json()));
        return Observable.throw(error.json() || {error: 'Server error'})
    }


}