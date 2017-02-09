import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {Router,  ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";
import {TeacherInfo} from "../../providers/data/teacher_info";

let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'tour-page',
    templateUrl: './take-tour.html',
    styleUrls: ["./take-tour.css"],
    providers: [  ServerErrorService ]
})
export class TakeTourComponent implements OnInit{
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public orgLogo: string = '';

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private router: Router,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private page: Page,
                private serverErrorService: ServerErrorService) {


        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        var teacherDetails = TeacherInfo.parsedDetails;
        this.orgLogo = teacherDetails.org_logo;
    }

    ngOnInit(){
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.page.actionBarHidden = true;
    }

    takeTour(){
        this.routerExtensions.navigate(["/tour"],
            {
                transition: {name: "slideLeft"},
                clearHistory: true
            });
    }

    skipTour(){
        this.routerExtensions.navigate(["/calendar"],
            {
                transition: {name: "slideLeft"},
                clearHistory: true
            });
    }



}
