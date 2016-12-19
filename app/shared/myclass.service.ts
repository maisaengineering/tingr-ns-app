import { Injectable } from '@angular/core';
//const faker = require('faker');

@Injectable()
export class MyClassService {
    getMyClass(): MyClass {

        const kids = [];


        /* Message Data */
        kids.push(
            {fname: 'Janie',lname: 'Deo' , age: 2, kid_klid: "", reminders_count: 2, notifications_count: 0},
            {fname: 'Johnny',lname: 'Deo' , age: 3, kid_klid: "", reminders_count: 0, notifications_count: 0},
            {fname: 'Janie',lname: 'Reo' , age: 3, kid_klid: "", reminders_count: 1, notifications_count: 0},
            {fname: 'Johnny',lname: 'Reo' , age: 2, kid_klid: "", reminders_count: 2, notifications_count: 1},
            {fname: 'Johnny',lname: 'Reo' , age: 2, kid_klid: "", reminders_count: 2, notifications_count: 1}
        );

        const myclass = {
            kids: kids
        };

        return myclass;
    }
}


export interface Kid {
    fname: String;
    lname: String;
    age: Number;
    kid_klid: String;
    reminders_count: Number;
    notifications_count: Number
}


export interface MyClass {
    kids: Array<Kid>;
}
