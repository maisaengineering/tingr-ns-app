import {Component} from "@angular/core";
import { TeacherInfo } from "../../providers/data/teacher_info";

@Component({
    moduleId: module.id,
    selector: 'drawer-content',
    templateUrl: './drawer.component.html',
})
export class DrawerComponent {

    public teacherInfo;
    public teacherFullname: String;
    public teacherPhotograph: String;

    constructor() {
        this.teacherInfo = TeacherInfo.parsedDetails;
        this.teacherFullname = this.teacherInfo.fname+ ' '+this.teacherInfo.lname;
        this.teacherPhotograph = this.teacherInfo.photograph;
    }
}
