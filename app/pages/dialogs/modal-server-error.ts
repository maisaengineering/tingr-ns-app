import {Component, OnInit} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";

let app = require("application");

@Component({
    selector: 'modal-content',
    template: ` 
       <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: white;" orientation="vertical" verticalAlignment="center">  
         <StackLayout orientation="vertical" >
          <Image src="~/images/server-error.jpg" stretch="aspectFit"></Image>     
         </StackLayout> 
         <Button width="100" text="Ok"
                    class="btn btn-primary blue2-background btn-rounded-sm" (tap)="close('close')"></Button>   
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
        //console.log("ModalContent.ngOnInit");
    }

    ngOnDestroy() {
        //console.log("ModalContent.ngOnDestroy");
    }
}