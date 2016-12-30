import {Component, OnInit} from "@angular/core";
import { AuthService } from "./shared/oauth/auth.service";


@Component({
    selector: 'app',
    template: '<page-router-outlet></page-router-outlet>',
    providers: [AuthService],
})
export class AppComponent implements OnInit{
    constructor(private authService: AuthService) { }

    ngOnInit() {
    }

}
