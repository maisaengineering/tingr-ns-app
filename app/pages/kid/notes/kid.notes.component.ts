import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, NavigationExtras} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {KidData} from "../../../providers/data/kid_data";
import {SharedData} from "../../../providers/data/shared_data";
import {InternetService} from "../../../shared/internet.service";
import { NotesService } from "../../../shared/notes.service";
var view = require("ui/core/view");
var tnsfx = require('nativescript-effects');
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./kid-notes.css'],
    templateUrl: './kid-notes.html',
    providers: [ NotesService]
})
export class KidNotesComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public notes: Array<any>;
    public notesDescription: string;

    constructor(private notesService: NotesService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.notes = [];
        this.kid = {};
        this.kid = this.kidData.info;
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        this.loadList();
    }

    loadList(){
        this.isLoading = true;
        this.notesService.getList('764217ee-d7ae-4baf-b0de-ab70e6db522c')
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.notes = body.notes;
                    this.isLoading = false;
                    console.log("Notes :" + JSON.stringify(this.notes))
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
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

}