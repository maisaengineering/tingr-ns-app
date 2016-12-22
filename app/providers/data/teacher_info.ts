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


}