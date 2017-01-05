import {Component, OnInit, NgModule, Input} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {ModalDialogService, ModalDialogOptions, ModalDialogHost} from "nativescript-angular/modal-dialog";
import {DatePicker} from "ui/date-picker";
import {Page} from "ui/page";
import { Router, NavigationExtras } from "@angular/router";

@Component({
    selector: 'modal-content',
    template: ` 
       <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: white;"> 
         <StackLayout class="m-x-10 m-t-15"> 
            <Button class="text-primary text-left font-weight-bold" text="Cancel" (tap)="cancel()"></Button>
         </StackLayout>
         <StackLayout class="hr-light m-15"></StackLayout>
         <DatePicker id="datePicker"></DatePicker> 
          <Button class="btn btn-primary btn-rounded-sm btn-active" text="Submit" (tap)="submit('Cancel')"></Button> 
       </StackLayout>
    `
})
export class ModalDatePicker implements OnInit{
    @Input() public prompt: string;
    constructor(private router: Router,private params: ModalDialogParams,private page: Page) {
        this.prompt = params.context.promptMsg;
    }


    ngOnInit(){
        let datePicker:DatePicker =<DatePicker> this.page.getViewById<DatePicker>("datePicker");
        let currentDate = new Date();
        datePicker.year = currentDate.getFullYear();

        datePicker.month = currentDate.getMonth() +1;
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