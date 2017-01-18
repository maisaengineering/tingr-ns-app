import {Location} from "@angular/common";

export class Page {

    constructor(private _location: Location) {
    }

    goBackLocation(): void {
        this._location.back();
    }
}