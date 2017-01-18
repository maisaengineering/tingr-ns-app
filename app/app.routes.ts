import {SettingsPage} from "./pages/settings/settings.page";
import {DrawerComponent} from "./components/drawer/drawer.component";
import { LoginPage } from "./pages/login/login.page";
import { ForgotPasswordComponent } from "./pages/login/forgot-password.component";
import { VerifyPasswordPage } from "./pages/verify-password/password.page";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { MyClassComponent } from "./pages/myclass/myclass.component";
import { KidDashboardComponent } from "./pages/kid/dashboard/kid-dashboard-component";
import { KidDocumentsComponent } from "./pages/kid/documents/kid.documents.component";
import { KidProfileComponent } from "./pages/kid/profile/kid.profile.component";
import { KidMomentComponent } from "./pages/kid/moment/kid.moment.component";
import { KidNotesComponent } from "./pages/kid/notes/kid.notes.component";
import { KidNotesEditComponent } from "./pages/kid/notes/kid.notes.edit.component";
import { FormsAndDocumentsComponent } from "./pages/kid/forms-and-docs/forms.docs.component";
import { FormOrDocWebviewComponent } from "./pages/kid/forms-and-docs/form.or.doc.webview.component";

import { AuthGuard } from "./auth-guard.service";
import { ModalDatePicker } from "./pages/dialogs/modal-date-picker";

export const APP_ROUTES = [

    { path: "", redirectTo: "/calendar", pathMatch: 'full'},
    { path: "calendar", component: CalendarComponent, canActivate: [AuthGuard] },
    { path: "myclass", component: MyClassComponent, canActivate: [AuthGuard] },
    { path: "kid-dashboard", component: KidDashboardComponent, canActivate: [AuthGuard]},
    { path: "kid-profile", component: KidProfileComponent, canActivate: [AuthGuard]},
    { path: "kid-documents", component: KidDocumentsComponent, canActivate: [AuthGuard]},
    { path: "kid-moment", component: KidMomentComponent, canActivate: [AuthGuard]},
    { path: "kid-notes", component: KidNotesComponent, canActivate: [AuthGuard]},
    { path: "kid-notes-edit", component: KidNotesEditComponent, canActivate: [AuthGuard]},
    { path: "kid-forms-and-docs", component: FormsAndDocumentsComponent, canActivate: [AuthGuard]},
    { path: "kid-form-or-doc-webview", component: FormOrDocWebviewComponent, canActivate: [AuthGuard]},
    { path: "settings", component: SettingsPage, canActivate: [AuthGuard]},
    { path: "verify-password", component: VerifyPasswordPage },
    { path: "login", component: LoginPage },
    { path: "forgot-password", component: ForgotPasswordComponent  },

    /* incase path="" redirectTo: "/home" then uncomment{
        path: "home",
        component: HomeComponent,
        children: [
            // '/home' loaded into `router-outlet` in main content
            { path: "", component: CalendarComponent },
            // '/home/otherPath' loaded into `router-outlet` in main content
           /!* { path: "otherPath", component: SomeOtherComponent },*!/
            // etc.
        ]
    } */
];

export const navigatableComponents = [
    LoginPage,
    VerifyPasswordPage,
    SettingsPage,
    DrawerComponent,
    CalendarComponent,
    MyClassComponent,
    KidDashboardComponent,
    KidProfileComponent,
    ModalDatePicker,
    ForgotPasswordComponent,
    KidDocumentsComponent,
    KidMomentComponent,
    KidNotesComponent,
    KidNotesEditComponent,
    FormsAndDocumentsComponent,
    FormOrDocWebviewComponent

];

export const authProviders = [
    AuthGuard
];
