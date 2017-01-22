import {Injectable} from "@angular/core";
import {Component, ViewContainerRef, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ModalServerError} from "../pages/dialogs/modal-server-error";

@Injectable()
export class ServerErrorService {


    constructor(private modal: ModalDialogService,
                private vcRef: ViewContainerRef) {

    }

    showErrorModal() {
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {},
            fullscreen: true
        };

        this.modal.showModal(ModalServerError, options).then((result) => {
            if(result === 'close'){
                // modal closed
            }else{

            }

        })
    }

}