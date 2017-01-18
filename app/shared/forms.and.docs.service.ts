import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";

@Injectable()
export class FormsAndDocsService {

    constructor(private http: Http) {

    }

    getList() {
        let formsAndDocs = [];
        formsAndDocs.push(
            { name: 'Student Identification',url: 'http://www.google.com'},
            { name: 'Permissions for Photographs/Video Recording',url: 'https://www.facebook.com/'},
            { name: 'Emergency Consent Form',url: 'https://tingr.org/'},
            { name: 'Multicultural Week',url: 'https://tingr.org/'},
            { name: 'Homeland Security Emergency Form',url: 'https://tingr.org/'},
            { name: 'Immunization Record',url: 'https://tingr.org/'},
        );
        return formsAndDocs;
    }


    handleErrors(error: any)  {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }


}