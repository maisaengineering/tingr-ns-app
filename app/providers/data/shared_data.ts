// from the ref: https://www.thepolyglotdeveloper.com/2016/10/passing-complex-data-angular-2-router-nativescript/

import { Injectable } from '@angular/core';
import { ManagedKid } from "../../shared/myclass.service";

@Injectable()
export class SharedData {

    public email: string; // to pass email from login to verify-password page

    // when teacher capture a moment from kid dashabord save the details to access in next page
    public momentCaptureDetails: any;

    // teacher manageKids data to be use in tagging a kid for mement
    public managedKids: any;

    //
    public kidNote: any;

    // when user clicks on form/doc hold the data to pass in next screen
    public formOrDoc: any;

    // to carry posKlId to next screen like hearters ,commenting on post etc..
    public postKlId: string;

    // to edit current post
    public currentPost: any;

    public constructor() { }

}