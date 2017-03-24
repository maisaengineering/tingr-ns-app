import {Component, OnInit} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";

let app = require("application");

@Component({
    selector: 'modal-content',
    template: ` 
       <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: #000000;" orientation="vertical" verticalAlignment="center">  
         <GridLayout rows="auto,*">
             <StackLayout class="m-t-15 m-r-20 m-b-15" row="0"  (tap)="close('close')" horizontalAlignment="right">
                <Label text="&#xE5CD;" class="text-right material-icons md-36 md-close" style="color: #ffffff"></Label>
             </StackLayout>
             <ScrollView row="1">
             <StackLayout orientation="vertical" verticalAlignment="center" >
                <Image [src]="imageUrls[0]" stretch="aspectFit"></Image>     
             </StackLayout>  
             </ScrollView>
         </GridLayout> 
       </StackLayout>
    `
})
export class ModalImageViewer implements OnInit {
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public imageUrls: Array<any>;

    constructor(private params: ModalDialogParams) {
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }

        this.imageUrls = params.context.imageUrls;
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