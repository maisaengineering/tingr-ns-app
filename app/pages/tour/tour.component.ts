import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {Router,  ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {InternetService} from "../../shared/internet.service";
import {ServerErrorService} from "../../shared/server.error.service";

let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'tour-page',
    templateUrl: './tour.html',
    styleUrls: ["./tour.css"],
    providers: [  ServerErrorService ]
})
export class TourComponent implements OnInit{
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public showActionBarItems: Boolean = false;
    public fromSettingsPage: Boolean = false;

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private router: Router,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private page: Page,
                private serverErrorService: ServerErrorService) {

        // get the conversationId from navigation params if this page is open from schedule
        this.route.queryParams.subscribe(params => {
            this.fromSettingsPage = params["fromSettingsPage"];
        });
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit(){
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.page.actionBarHidden = true;


    }

    skip(){
        if(this.fromSettingsPage){
            this.routerExtensions.navigate(["/settings"],
                {
                    transition: {name: "slideTop"}
                });
        }else{
            this.routerExtensions.navigate(["/calendar"],
                {
                    transition: {name: "slideLeft"},
                    clearHistory: true
                });
        }


    }



}
