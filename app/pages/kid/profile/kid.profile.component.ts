import {Component,ViewContainerRef,ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {InternetService} from "../../../shared/internet.service";
import {ServerErrorService} from "../../../shared/server.error.service";
import {KidService} from "../../../shared/kid.service";
var view = require("ui/core/view"); 
var app = require("application");
import {Location} from "@angular/common";
@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-profile.css'],
    templateUrl: './kid-profile.html',
    providers: [KidService, ServerErrorService]
})
export class KidProfileComponent implements OnInit {
    public kid: any;
    public topmost;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public showActionBarItems: Boolean = false;

    constructor(private kidService: KidService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService,
                private _location: Location) {
        //super(changeDetectorRef);

        this.kid = {};
        this.kid = kidData.info;
        //console.log("Kid Data : "+ JSON.stringify(this.kid));

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }

    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.kidService.getProfileDetails(this.kid.kid_klid)
            .subscribe(
                (result) => {
                    this.kid =  result.body; // update kid info//
                    // save details in provider
                    this.kidData.info = this.kid;
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
       /* this.routerExtensions.navigate(["/kid-dashboard"], {
            transition: {
                name: "slideTop"
            }
        });*/
    }

    closeProfile(){
        this.routerExtensions.back();
    }

}