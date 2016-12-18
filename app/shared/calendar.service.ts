import { Injectable } from '@angular/core';
//const faker = require('faker');

@Injectable()
export class CalendarService {
    getCalendar(): Calendar {
        const today = "Sunday January, 1st";
        const messages = [];

        messages.push({
            time: "2-00:2-30pm",
            event: "Kis Arrival"
        });

        messages.push({
            time: "2-30:3-00pm",
            event: "Snacks"
        });

        messages.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        messages.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        messages.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        messages.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        messages.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });

        const calendar = {
            messages: messages
        };

        return calendar;
    }
}



export interface Message {
    time: String;
    event: string;
}

export interface Calendar {
    messages: Array<Message>;
}
