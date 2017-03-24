import { NativeScriptModule } from "nativescript-angular/nativescript.module";

// --- The built-in 'nativescript-telerik-ui' modules
import { NativeScriptUISideDrawerModule } from "nativescript-telerik-ui/sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-telerik-ui/listview/angular";

import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NativeScriptFormsModule } from "nativescript-angular/forms";

import {AppComponent} from "./app.component";
//import {SIDEDRAWER_DIRECTIVES} from "nativescript-telerik-ui/sidedrawer/angular";
//import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';
import {APP_ROUTES, authProviders, navigatableComponents} from "./app.routes";
import { TeacherInfo } from "./providers/data/teacher_info";
import { TokenService } from "./shared/token.service";
import {KidData} from "./providers/data/kid_data"
import {SharedData} from "./providers/data/shared_data"
import { InternetService } from "./shared/internet.service"
import { ServerErrorService } from "./shared/server.error.service"

import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ModalDatePicker } from "./pages/dialogs/modal-date-picker";
import { ModalPostComment } from "./pages/dialogs/modal-post-comment";
import { ModalMessageToParent } from "./pages/dialogs/modal-message-to-parent";
import { ModalServerError } from "./pages/dialogs/modal-server-error";
import { ModalEditProfile } from "./pages/dialogs/modal-edit-profile";
import { ModalImageViewer } from "./pages/dialogs/modal-image-viewer";

import { DatePipe } from '@angular/common';
import { KeysPipe } from './utils/keys.pipe';
import { TimeAgoPipe } from './utils/timeago.pipe';
import { ShortNamePipe } from './utils/short-name.pipe';

import { TNSFrescoModule } from "nativescript-fresco/angular";
import * as frescoModule from "nativescript-fresco";
import * as applicationModule from "application"; 
 
import { registerElement, ViewClass } from "nativescript-angular/element-registry";
registerElement("CardView", () => require("nativescript-cardview").CardView);
registerElement("PullToRefresh", () => {
    var viewClass = require("nativescript-pulltorefresh").PullToRefresh;
    return viewClass;
});

registerElement("Carousel", () => require("nativescript-carousel").Carousel);
registerElement("CarouselItem", () => require("nativescript-carousel").CarouselItem); 
//registerElement("FrescoDrawee", () => frescoModule.FrescoDrawee);

if (applicationModule.android) {
    applicationModule.on("launch", () => {
        frescoModule.initialize();
    });
}
@NgModule({
    declarations: [
        AppComponent,
        KeysPipe,
        TimeAgoPipe,
        ShortNamePipe,
        ...navigatableComponents
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptUIListViewModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        TNSFrescoModule,
        NativeScriptRouterModule.forRoot(APP_ROUTES)
    ],
    providers: [
        TeacherInfo,
        TokenService,
        authProviders,
        DatePipe,
        ModalDialogService,
        KidData,
        SharedData,
        InternetService,
        ServerErrorService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        ModalDatePicker,
        ModalPostComment,
        ModalMessageToParent,
        ModalServerError,
        ModalEditProfile,
        ModalImageViewer
    ]
})
export class AppModule {
}
