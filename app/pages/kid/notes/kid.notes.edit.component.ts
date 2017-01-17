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
    templateUrl: './kid-notes-edit.html',
    providers: [ NotesService]
})
export class KidNotesEditComponent implements OnInit {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public notesDescription: string;

    constructor(private notesService: NotesService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private kidData: KidData,
                private sharedData: SharedData,
                private internetService: InternetService) {
        //super(changeDetectorRef);
        this.kid = {};
        this.kid = this.kidData.info;
        this.notesDescription = '';
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
    }


    saveNotes(isEdit){
        let kid_klid= '764217ee-d7ae-4baf-b0de-ab70e6db522c';
        let description = this.notesDescription.trim();
        if(description){
            this.isLoading = true;
            if(isEdit){
                this.updateNote(kid_klid, description)
            }else{
                this.createNote(kid_klid, description)
            }
        }else{
            dialogs.alert({
                title: "",
                message: "Notes description can't be blank",
                okButtonText: "Ok"
            }).then(()=>{});
        }

    }

    createNote(kid_klid, description){
        this.notesService.createNote(kid_klid, description)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    let toastOptions = {
                        text: result.message,
                        duration : nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(toastOptions);
                    this.routerExtensions.navigate(["/kid-notes"], {
                        transition: {
                            name: "slideRight"
                        }
                    });
                },
                (error) => {
                    this.isLoading = false;
                    alert('Internal server error.');
                }
            );
    }

    updateNote(kid_klid, description){
        //TODO
    }

}