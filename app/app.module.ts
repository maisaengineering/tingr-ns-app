import { NativeScriptModule } from 'nativescript-angular/platform';
import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import {AppComponent} from "./app.component";
import {SIDEDRAWER_DIRECTIVES} from "nativescript-telerik-ui/sidedrawer/angular";
import {NativeScriptRouterModule} from "nativescript-angular";
import {TNSFontIconModule} from "nativescript-ng2-fonticon";
import {APP_ROUTES, authProviders, navigatableComponents} from "./app.routes";
import { TeacherInfo } from "./providers/data/teacher_info";
import { TokenService } from "./shared/token.service";

import { DatePipe } from '@angular/common';

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
        DatePipe
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule {
}
