import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {MyClassService, Kid} from "../../shared/myclass.service";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';



@Component({
    selector: 'my-app',
    styleUrls: ['pages/myclass/myclass.css'],
    templateUrl: 'pages/myclass/myclass.component.html',
    providers: [MyClassService]
})
export class MyClassComponent extends DrawerPage implements OnInit{
    public kids: Array<Kid>;

    constructor(private myClassService: MyClassService,private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
        const myclass = myClassService.getMyClass();
        this.kids = myclass.kids;

    }

    ngOnInit() {

    }
}