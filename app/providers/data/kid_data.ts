import { Injectable } from '@angular/core';
import { ManagedKid } from "../../shared/myclass.service";

@Injectable()
export class KidData {

    public info: ManagedKid;

    public constructor() { }

}