import {Component, ViewContainerRef, OnInit, NgModule, Input} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {Page} from "ui/page";
//let tnsfx = require('nativescript-effects');
let view = require("ui/core/view");
let app = require("application");

@Component({
    selector: 'modal-content',
    providers: [],
    template: ` 
      <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: white; border-radius: 10;">
   
    <StackLayout class="m-x-20 m-t-10" verticalALignment="center">  
            <Gridlayout cols="auto,auto,auto" verticalAlignment="center">
            <StackLayout (tap)="close('close')" class="text-primary blue2" row="0" col="0" orientation="horizontal"> 
               <Label text="&#xE5CD;" class="text-left material-icons md-36 md-chevron-right"></Label>
            </StackLayout>
            <Label row="0" col="1" class="action-label" horizontalAlignment="center" text="Edit Profile"></Label>
            
             <StackLayout (tap)="submit()"  class="text-primary blue2" row="0" col="2"  horizontalAlignment="right" orientation="horizontal">  
               <Label text="&#xE5CA;" class="material-icons md-36 md-chevron-right"></Label>
             </StackLayout> 
            </Gridlayout>  
         </StackLayout>
         <StackLayout class="hr-light m-15"></StackLayout>
    <StackLayout orientation="vertical"> 
        <GridLayout rows="*">
            <StackLayout row="0" verticalAlignment="top" class="m-t-20">
                <GridLayout rows="auto,auto" class="p-20">
                    <StackLayout row="0">
                        <TextField class="input input-border input-border-primary input-field" hint="First Name"
                                   [(ngModel)]="fname"
                                   id="fname"></TextField>
                        <Label *ngIf="fnameError" visibility="{{ fname ? 'collapse' : 'visible' }}"
                               text="first name can't be blank" class="error-label"></Label>
                    </StackLayout>
                    <StackLayout row="1" class="p-t-10">
                        <TextField class="input input-border input-border-primary input-field"
                                   hint="last name" [(ngModel)]="lname"
                                   id="lname"></TextField>
                        <Label *ngIf="lnameError" visibility="{{ lname ? 'collapse' : 'visible' }}"
                               text="last name can't be blank" class="error-label"></Label>
                    </StackLayout>
                </GridLayout>
            </StackLayout>
        </GridLayout> 
    </StackLayout>
</StackLayout>
      
    `
})
export class ModalEditProfile implements OnInit {
    @Input() public teacher_klid: string;
    @Input() public fname: string;
    @Input() public lname: string;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public fnameError: Boolean = false;
    public lnameError: Boolean = false;

    constructor(private params: ModalDialogParams,
                private page: Page,
                private vcRef: ViewContainerRef) {
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        this.fname = params.context.fname;
        this.lname = params.context.lname;
        this.teacher_klid = params.context.teacher_klid;
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

    public submit() {
        // validate form
        let fnameTextfield = view.getViewById(this.page, "fname");
        let lnameTextfield = view.getViewById(this.page, "lname");
        fnameTextfield.dismissSoftInput();
        lnameTextfield.dismissSoftInput();
        let hasErrors = false;
        if (this.fname === '') {
            this.fnameError = true;
            hasErrors = true;
        }
        if (this.lname === '') {
            this.lnameError = true;
            hasErrors = true;
        }
        if (hasErrors) {
            return;
        } else {
            this.params.closeCallback({fname: this.fname.trim(), lname: this.lname.trim()})
        }
    }


    ngOnInit() {
        //console.log("ModalContent.ngOnInit");
    }

    ngOnDestroy() {
        //console.log("ModalContent.ngOnDestroy");
    }
}