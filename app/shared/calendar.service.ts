import { Injectable } from '@angular/core';
//const faker = require('faker');

@Injectable()
export class CalendarService {
    getCalendar(): Calendar {
        const today = "Sunday January, 1st";
        const schedules = [];
        const reminders = [];
        const messages = [];

        schedules.push({
            time: "2-00:2-30pm",
            event: "Kis Arrival"
        });

        schedules.push({
            time: "2-30:3-00pm",
            event: "Snacks"
        });

        schedules.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        schedules.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        schedules.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        schedules.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });
        schedules.push({
            time: "3-00:3-30pm",
            event: "HomeWork/Worsheet"
        });

        const calendar = {
            schedules: schedules,
            reminders: reminders,
            messages: messages
        };

        return calendar;
    }
}


export interface Schedule {
    time: String;
    event: string;
}

export interface Reminder {
    text: String;
}


export interface Message {
    kid_name: String;
    relation: String;
    text: String;

}

export interface Calendar {
    schedules: Array<Schedule>;
    reminders: Array<Reminder>;
    messages: Array<Message>;
}
