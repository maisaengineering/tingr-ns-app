import { Injectable } from '@angular/core';
//const faker = require('faker');

@Injectable()
export class CalendarService {
    getCalendar(): Calendar {
        const today = "Sunday January, 1st";
        const schedules = [];
        const reminders = [];
        const messages = [];

        /* Scedule Data */
        schedules.push(
            { time: "2-00:2-30pm", event: "Kis Arrival" },
            { time: "2-30:3-00pm", event: "Snacks" },
            { time: "3-00:3-30pm", event: "HomeWork/Worksheet" },
            { time: "3-00:3-30pm", event: "HomeWork/Worksheet" },
            { time: "3-00:4-15pm", event: "Dance" },
            { time: "4-15:5-00pm", event: "Spelling practice" },
            { time: "5-00:5-30pm", event: "Reading Practice"  },
            { time: "5-30:6-00pm", event: "Evening Snacks, Free Play & Outdoor",  read: true }
        );

        /* Reminders Data */
        reminders.push(
            {text: "Jonie's birthday Turing 3 years"},
            {text: "Ask parent's to bring toys"},
            {text: "TOMORROW is school holiday", read: true}
        );

        /* Message Data */
        messages.push(
            {kid_name: 'John Reo', relation: "Jonie's father", text: "Jonie has bit cold.Please call us if it get worst!", read: true},
            {kid_name: 'Jane Deo', relation: "Johnny's mather", text: "We would like to pickup him up around 5pm today", read: false},
            {kid_name: 'Jane Deo', relation: "Johnny's mather", text: "I am on-my way", read: true}
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
    read: Boolean;

}

export interface Calendar {
    schedules: Array<Schedule>;
    reminders: Array<Reminder>;
    messages: Array<Message>;
}
