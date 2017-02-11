import {Component} from "@angular/core";
import { TeacherInfo } from "../../providers/data/teacher_info";
import {TeacherService} from "../../shared/teacher/teacher.service";
let app = require("application");
@Component({
    moduleId: module.id,
    selector: 'drawer-content',
    templateUrl: './drawer.component.html',
    providers: [TeacherService]
})
export class DrawerComponent {

    public teacherInfo;
    public teacherFullname: String;
    public teacherPhotograph: String;
    public teacherEmail: String;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    constructor(private teacherService: TeacherService) {
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }

        this.teacherInfo = TeacherInfo.parsedDetails;
        this.teacherFullname = this.teacherInfo.fname+ ' '+this.teacherInfo.lname;
        this.teacherPhotograph = this.teacherInfo.photograph;
        this.teacherEmail = this.teacherInfo.email;
        // update teacher profile in background
        this.getProfileDetails();
    }

    getProfileDetails(){
        let teacher_klid = this.teacherInfo.teacher_klid;
        this.teacherService.profileDetails(teacher_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.teacherInfo.photograph = body.photograph;
                    this.teacherInfo.fname = body.fname;
                    this.teacherInfo.lname = body.lname;
                    // update Teacher Info
                    TeacherInfo.details = JSON.stringify(this.teacherInfo);
                },
                (error) => {

                }
            );
    }

}



