// from the ref: https://www.thepolyglotdeveloper.com/2016/10/passing-complex-data-angular-2-router-nativescript/

import { Injectable } from '@angular/core';
import { ManagedKid } from "../../shared/myclass.service";

@Injectable()
export class SharedData {

    public email: string; // to pass email from login to verify-password page

    public constructor() { }

}