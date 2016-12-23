import {Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {MyClassService, ManagedKid} from "../../shared/myclass.service";

import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view';
import { GridLayout } from "ui/layouts/grid-layout";
// >> long-press-code
import { GestureEventData } from "ui/gestures";


@Component({
    selector: 'my-app',
    styleUrls: ['pages/myclass/myclass.css'],
    templateUrl: 'pages/myclass/myclass.component.html',
    providers: [MyClassService]
})
export class MyClassComponent extends DrawerPage implements OnInit{
    public managed_kids: Array<ManagedKid>;

    constructor(private myClassService: MyClassService,private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);

    }

    ngOnInit() {
        this.myClassService.getManagedKids()
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.managed_kids = body.managed_kids
                },
                (error) => {
                    console.log('Error: '+ JSON.stringify(error));
                    alert(JSON.stringify(error))
                }
            );
    }

    onLongPress(args: GestureEventData) {
        console.log("LongPress!");
        console.log("Object that triggered the event: " + args.object);
        console.log("View that triggered the event: " + args.view);
        console.log("Event name: " + args.eventName);
    }
}