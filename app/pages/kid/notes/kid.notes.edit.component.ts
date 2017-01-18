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
    public kidNote: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public notesDescription: string;
    public isEdit: Boolean = false;
    public showActionBarItems: Boolean = false;

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
        this.kidNote = this.sharedData.kidNote;

        if(this.kidNote.is_edit){
            this.isEdit = true;
            this.notesDescription = this.kidNote.description;
        }else{
            this.isEdit = false;
            this.notesDescription = '';
        }

        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
        this.internetService.alertIfOffline();
        // show actionBarItems after some time to fix overlapping issue
        setTimeout(() => {
            this.showActionBarItems = true;
        }, 500);

    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }

    saveNotes(isEdit){
        let description = this.notesDescription.trim();
        if(description){
            this.isLoading = true;
            if(isEdit){
                this.updateNote(description)
            }else{
                this.createNote(description)
            }
        }else{
            dialogs.alert({
                title: "",
                message: "Notes description can't be blank",
                okButtonText: "Ok"
            }).then(()=>{});
        }

    }

    createNote(description){
        let kid_klid= this.kid.kid_klid;
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

    updateNote(description){
        let note_kl_id = this.kidNote.kl_id;
        this.notesService.updateNote(note_kl_id, description)
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

    deleteNote(){
        dialogs.confirm("Are you sure?").then((result)=> {
            if(result){
                this.isLoading = true;
                let note_kl_id = this.kidNote.kl_id;
                this.notesService.deleteNote(note_kl_id)
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
        });
    }

}