import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";

@Injectable()
export class ReminderService {

    constructor(private http: Http) {

    }

    getList() {
        let reminders = [];
        reminders.push(
            { kl_id: 1,name: 'Today is sharing day',created_at: "2017-01-17T03:29:15.692-05:00" , seen: false },
            { kl_id: 2,name: "Remind parents about Monster's Inc. Summer Camp.Enrollement starts from today.",
                created_at: "2017-01-17T03:29:15.692-05:00" , seen: false },
            { kl_id: 3, name: "Missing 'Emergency Consent Form",created_at: "2017-01-17T03:29:15.692-05:00" , seen: false },
            { kl_id: 4, name: 'Today is sharing day',created_at: "2017-01-17T03:29:15.692-05:00" , seen: false },
            { kl_id: 5,name: 'Signout record missing for 01/01/15',created_at: "2017-01-15T03:29:15.692-05:00" , seen: true },
        );
        return reminders;
    }


    handleErrors(error: any)  {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }


}