import {Component} from "@angular/core";
import { TeacherInfo } from "../../providers/data/teacher_info";

@Component({
    selector: 'drawer-content',
    templateUrl: 'components/drawer/drawer.component.html',
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
