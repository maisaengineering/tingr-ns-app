import {Component, OnInit, NgModule, Input} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {ModalDialogService, ModalDialogOptions, ModalDialogHost} from "nativescript-angular/modal-dialog";
import {DatePicker} from "ui/date-picker";
import {Page} from "ui/page";
import { Router, NavigationExtras } from "@angular/router";

@Component({
    selector: 'modal-content',
    template: `
       <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: #9fc5f8;">
    <DatePicker id="datePicker"></DatePicker>
    <Button class="btn btn-primary btn-active" text="Submit" (tap)="submit('Cancel')"></Button>
</StackLayout>
    `
})
export class ModalDatePicker implements OnInit{
    @Input() public prompt: string;
    constructor(private router: Router,private params: ModalDialogParams,private page: Page) {
        console.log("ModalContent.constructor: " + JSON.stringify(params));
        this.prompt = params.context.promptMsg;
    }


    ngOnInit(){
        console.log("ModalContent.ngOnInit");
        let datePicker:DatePicker =<DatePicker> this.page.getViewById<DatePicker>("datePicker");
        let currentDate = new Date();
        datePicker.year = currentDate.getFullYear();
        datePicker.month = currentDate.getMonth();
        datePicker.day = currentDate.getDate();
        datePicker.minDate = new Date(1975, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);
    }

    public submit(res: string) {

        //TODO get the result in Calendar Component
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");

        /* console.log("Year1111111111111 " + datePicker.year);
         console.log("MOnth " + datePicker.month);
         console.log("Date " + datePicker.day);*/
        // this.params.closeCallback(res);


        /*let navigationExtras: NavigationExtras = {
            queryParams: {
                "date": '28/12/2016'
            }
        };*/


       // this.params.closeCallback(new Date(datePicker.year, datePicker.month, datePicker.day));
        // this.router.navigate(["/calendar"], navigationExtras);

        //console.log('HEEEEEEEEEEEEEEEEEEE  '+datePicker.date);

        this.params.closeCallback(datePicker.date);



        //let datePicker:DatePicker =<DatePicker> this.page.getViewById<DatePicker>("datePicker");
        //this.params.closeCallback();
    }



    ngOnDestroy() {
        console.log("ModalContent.ngOnDestroy");
    }
}