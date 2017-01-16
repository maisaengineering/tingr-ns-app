import {Component, OnInit, NgModule, Input} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {ModalDialogService, ModalDialogOptions, ModalDialogHost} from "nativescript-angular/modal-dialog";
import {DatePicker} from "ui/date-picker";
import {Page} from "ui/page";
import {Router, NavigationExtras} from "@angular/router";

@Component({
    selector: 'modal-content',
    template: ` 
       <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: white;"> 
         <StackLayout class="m-x-20 m-t-15" verticalALignment="center">  
            <Gridlayout cols="auto,auto" verticalAlignment="center">
            <StackLayout (tap)="cancel()" class="text-primary blue2" row="0" col="0" orientation="horizontal">
               <!-- <Label class="fa m-r-5" text=""></Label>-->
                <Label class="text-left font-weight-bold" text="Cancel"></Label>
            </StackLayout>
             <StackLayout (tap)="submit('Cancel')"  class="text-primary blue2" row="0" col="0"  horizontalAlignment="right" orientation="horizontal">
                <!--<Label class="fa m-r-5" text=""></Label>-->
               <Label class="font-weight-bold" text="Submit"></Label> 
             </StackLayout> 
            </Gridlayout>  
         </StackLayout>
         <StackLayout class="hr-light m-15"></StackLayout>
         <DatePicker id="datePicker"></DatePicker>  
       </StackLayout>
    `
})
export class ModalDatePicker implements OnInit {
    @Input() public prompt: string;

    constructor(private router: Router, private params: ModalDialogParams, private page: Page) {
        this.prompt = params.context.promptMsg;
    }


    ngOnInit() {
        let datePicker: DatePicker = <DatePicker> this.page.getViewById<DatePicker>("datePicker");
        let currentDate = new Date();
        datePicker.year = currentDate.getFullYear();

        datePicker.month = currentDate.getMonth() + 1;
        datePicker.day = currentDate.getDate();
        datePicker.minDate = new Date(1975, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);
    }

    public submit(res: string) {

        //TODO get the result in Calendar Component
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");

        // this.params.closeCallback(res);


        /*let navigationExtras: NavigationExtras = {
         queryParams: {
         "date": '28/12/2016'
         }
         };*/


        // this.params.closeCallback(new Date(datePicker.year, datePicker.month, datePicker.day));
        // this.router.navigate(["/calendar"], navigationExtras);

        this.params.closeCallback(datePicker.date);


        //let datePicker:DatePicker =<DatePicker> this.page.getViewById<DatePicker>("datePicker");
        //this.params.closeCallback();
    }

    public cancel() {
        this.params.closeCallback('');

    }


    ngOnDestroy() {
    }
}