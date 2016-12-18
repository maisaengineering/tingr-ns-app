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
            },
            {
                time: "2-30:3-00pm",
                event: "Snacks"
            },
            {
                time: "3-00:3-30pm",
                event: "HomeWork/Worksheet"
            },
            {
                time: "3-00:3-30pm",
                event: "HomeWork/Worksheet"
            },
            {
                time: "3-00:4-15pm",
                event: "Dance"
            },
            {
                time: "4-15:5-00pm",
                event: "Spelling practice"
            },
            {
                time: "5-00:5-30pm",
                event: "Reading Practice"
            },
            {
                time: "5-30:6-00pm",
                event: "Evening Snacks, Free Play & Outdoor",
                read: true
            });

        /* Reminders Data */
        reminders.push(
            {text: "Jonie's birthday Turing 3 years"},
            {text: "Ask parent's to bring toys"},
            {text: "TOMORROW is school holiday", read: true},
        );

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
    event: String;
    read: Boolean;
}

export interface Reminder {
    text: String;
    read: Boolean;
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
