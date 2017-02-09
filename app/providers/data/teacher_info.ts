import { Injectable } from '@angular/core';
import { getString, setString } from "application-settings";

@Injectable()
export class TeacherInfo {

    public storage: any;

    public constructor() { }

    static get details(): string {
        return getString("teacherDetails");
    }

    static set details(str: string) {
        setString("teacherDetails", str);
    }

    static get parsedDetails(): any {
        return JSON.parse(getString("teacherDetails"));
    }

    // Set Current room when teacher selected
    static get currentRoom(): string {
        return getString("currentRoom");
    }

    static set currentRoom(str: string) {
        setString("currentRoom", str);
    }

    static get parsedCurrentRoom(): any {
        return JSON.parse(getString("currentRoom"));
    }


}