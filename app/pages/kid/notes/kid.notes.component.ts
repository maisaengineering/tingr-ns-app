import {Component, ViewContainerRef,  ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import {ServerErrorService} from "../../../shared/server.error.service";
import { NotesService } from "../../../shared/notes.service";
var view = require("ui/core/view");
//var tnsfx = require('nativescript-effects');
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-notes.css'],
    templateUrl: './kid-notes.html',
    providers: [ NotesService, ServerErrorService]
})
export class KidNotesComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public notes: Array<any>;
    public notesDescription: string;
    public emptyNoteMessage: string;
    public showActionBarItems: Boolean = false;

    constructor(private notesService: NotesService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        //super(changeDetectorRef);
        this.notes = [];
        this.kid = {};
        this.kid = this.kidData.info;
        this.emptyNoteMessage = "start taking handy student notes today...." +
            "notes are private to kid/school--never shared with any parent. only your co-teacher can see your notes.";

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        // Hide 'Default Back button'
        if(this.isIos){
            var controller = frameModule.topmost().ios.controller;
            // get the view controller navigation item
            var navigationItem = controller.visibleViewController.navigationItem;
            // hide back button
            navigationItem.setHidesBackButtonAnimated(true, false);
        }

        // show actionBarItems after some time to fix overlapping issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);

        this.loadList();
    }

    loadList(){
        this.isLoading = true;
        let kid_klid = this.kid.kid_klid;
        this.notesService.getList(kid_klid)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.notes = body.notes;
                    this.isLoading = false;
                    //console.log("Notes :" + JSON.stringify(this.notes))
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    addNote(){
        // save data to access in next page
        this.sharedData.kidNote = {
            is_edit: false
        };
        this.routerExtensions.navigate(["/kid-notes-edit"], {
            transition: {
                name: "slideLeft"
            }
        });
    }

    editNote(note){
        // save data to access in next page
        this.sharedData.kidNote = {
            is_edit: true,
            kl_id: note.kl_id,
            description: note.description,
            created_at: note.created_at
        };
        this.routerExtensions.navigate(["/kid-notes-edit"], {
            transition: {
                name: "slideLeft"
            }
        });
    }

    goBack(){
       // this.routerExtensions.backToPreviousPage();
        this.routerExtensions.navigate(["/kid-dashboard"], {
            transition: {
                name: "slideRight"
            }
        });
    }

}