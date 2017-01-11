import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NativeScriptFormsModule } from "nativescript-angular/forms";

import {AppComponent} from "./app.component";
import {SIDEDRAWER_DIRECTIVES} from "nativescript-telerik-ui/sidedrawer/angular";
import {TNSFontIconModule} from "nativescript-ng2-fonticon";
import {APP_ROUTES, authProviders, navigatableComponents} from "./app.routes";
import { TeacherInfo } from "./providers/data/teacher_info";
import { TokenService } from "./shared/token.service";
import {KidData} from "./providers/data/kid_data"
import {SharedData} from "./providers/data/shared_data"
import { InternetService } from "./shared/internet.service"

import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/modal-dialog";

import { DatePipe } from '@angular/common';
import {registerElement} from "nativescript-angular/element-registry";
registerElement("CardView", () => require("nativescript-cardview").CardView);


import { ModalDatePicker } from "./pages/dialogs/modal-date-picker";
@NgModule({
    declarations: [
        SIDEDRAWER_DIRECTIVES,
        AppComponent,
        ...navigatableComponents
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(APP_ROUTES),
        TNSFontIconModule.forRoot({
            'fa': 'fonts/font-awesome.css'
        })
    ],
    providers: [
        TeacherInfo,
        TokenService,
        authProviders,
        DatePipe,
        ModalDialogService,
        KidData,
        SharedData,
        InternetService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [ModalDatePicker]
})
export class AppModule {
}
