import { Injectable } from '@angular/core';
//const faker = require('faker');
import { Observable } from "rxjs/Rx";
import { Http, Headers, Response } from "@angular/http";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { TeacherInfo } from "../providers/data/teacher_info";
import {TokenService} from "../shared/token.service";
import {Config} from "../shared/config";

import { DatePipe } from '@angular/common';


@Injectable()
export class CalendarService {

    currentDateStr: String;
    //schedules: Array<any>;

    constructor(private http: Http,private teacherInfo: TeacherInfo, private datePipe: DatePipe) {

    }


    getCalendarData(currentDate) {
        this.currentDateStr = this.datePipe.transform(currentDate, 'dd/MM/yyyy');


        var room = TeacherInfo.parsedDetails.rooms[0];
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "all_events",
            body: {
                session_id: room.session_id,
                season_id: room.season_id,
                date: this.currentDateStr//this.currentDateStr
            }
        });

        return this.http.post(
            Config.apiUrl + "teachers", data, {
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


export interface Schedule {
    name: String;
    description: String;
    start_time: String,
    end_time: String
}

export interface Reminder {
    text: String;
    read: Boolean;
}


export interface Message {
    text: string,
    sender_name: string,
    photograph: string,
    child_name: string,
    child_relationship: string,
    conversation_klid: string,
    created_at: string,
    read_message: boolean
}

export interface Calendar {
    today: Date;
    schedules: Array<Schedule>;
    reminders: Array<Reminder>;
    messages: Array<Message>;
}

export interface Birthday {
    child_name: string,
    age: number,
    birthdate: string
}

export interface EventReminder {
    name: string,
    description: string,
    start_time: string,
    end_time: string
}

export interface Holiday {
    name: string,
    description: string,
    start_time: string,
    end_time: string
}

