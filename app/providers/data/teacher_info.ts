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



    /*
    0/p of
    TeacherInfo.details =>
     {
     "auth_token": "i3Ey_hUNR3uCUc-biRda",
     "fname": "teacher1",
     "lname": "org1",
     "email": "teacher1@org1.com",
     "teacher_klid": "77bb8d19-e791-4d67-8d07-4f5a623d0d9a",
     "photograph": "",
     "rooms": [{
     "session_id": "5847a5d83537320004080000",
     "season_id": "5847a5d83537320004020000",
     "organization_id": "5847a5d83537320004000000"
     }]
     }


     */

}