import {Component, OnInit, NgModule, Input} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {ModalDialogService, ModalDialogOptions, ModalDialogHost} from "nativescript-angular/modal-dialog";
import {DatePicker} from "ui/date-picker";
import {Page} from "ui/page";
import {Router, NavigationExtras} from "@angular/router";


let app = require("application");

@Component({
    selector: 'modal-content',
    template: ` 
       <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: white;"> 
         <StackLayout class="m-x-20 m-t-15" verticalALignment="center">  
            <Gridlayout cols="auto,auto" verticalAlignment="center"> 
             <StackLayout (tap)="close('close')" class="text-primary blue2" row="0" col="0"  horizontalAlignment="right" orientation="horizontal">  
               <Label text="&#xE5CD;" class="text-left material-icons md-36 md-close"></Label>
             </StackLayout> 
            </Gridlayout>  
         </StackLayout>
         <StackLayout class="hr-shadow m-5"></StackLayout>
         <StackLayout orientation="vertical">
          <Image src="~/images/server-error.jpg" stretch="aspectFit"></Image>     
         </StackLayout>
          
       </StackLayout>
    `
})
export class ModalServerError implements OnInit {
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(private params: ModalDialogParams) {
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

    ngOnInit() {
        console.log("ModalContent.ngOnInit");
    }

    ngOnDestroy() {
        console.log("ModalContent.ngOnDestroy");
    }
}