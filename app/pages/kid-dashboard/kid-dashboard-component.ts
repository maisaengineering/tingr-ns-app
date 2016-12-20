import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';
import { GridLayout } from "ui/layouts/grid-layout";


@Component({
    selector: 'my-app',
    styleUrls: ['pages/kid-dashboard/kid-dashboard.css'],
    templateUrl: 'pages/kid-dashboard/kid-dashboard.html',
    providers: []
})
export class KidDashboardComponent extends DrawerPage implements OnInit{

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
    }

    ngOnInit() {

    }


}