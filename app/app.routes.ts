import {SettingsPage} from "./pages/settings/settings.page";
import {DrawerComponent} from "./components/drawer/drawer.component";
import { LoginPage } from "./pages/login/login.page";
import { ForgotPasswordComponent } from "./pages/login/forgot-password.component";
import { VerifyPasswordPage } from "./pages/verify-password/password.page";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { MyClassComponent } from "./pages/myclass/myclass.component";
import { KidDashboardComponent } from "./pages/kid/dashboard/kid-dashboard-component";
import { KidProfileComponent } from "./pages/kid/profile/kid.profile.component";
import { KidMomentComponent } from "./pages/kid/moment/kid.moment.component";
import { KidEditMomentComponent } from "./pages/kid/moment/kid.edit.moment.component";
import { KidNotesComponent } from "./pages/kid/notes/kid.notes.component";
import { KidNotesEditComponent } from "./pages/kid/notes/kid.notes.edit.component";
import { FormsAndDocumentsComponent } from "./pages/kid/forms-and-docs/forms.docs.component";
import { FormOrDocWebviewComponent } from "./pages/kid/forms-and-docs/form.or.doc.webview.component";
import { KidRemindersComponent } from "./pages/kid/reminders/kid.reminders.component";
import { MessagesComponent } from "./pages/messages/messages.component";
import { HeartersComponent } from "./pages/posts/hearters.component";
import { ChangePasswordComponent } from "./pages/change-password/change-password.component";
import { MySchoolComponent } from "./pages/settings/myschool.component";

import { AuthGuard } from "./auth-guard.service";
import { ModalDatePicker } from "./pages/dialogs/modal-date-picker";
import { ModalPostComment } from "./pages/dialogs/modal-post-comment";
import { ModalMessageToParent } from "./pages/dialogs/modal-message-to-parent";
import { ModalServerError } from "./pages/dialogs/modal-server-error";

export const APP_ROUTES = [

    { path: "", redirectTo: "/myclass", pathMatch: 'full'},
    { path: "calendar", component: CalendarComponent, canActivate: [AuthGuard] },
    { path: "myclass", component: MyClassComponent, canActivate: [AuthGuard] },
    { path: "kid-dashboard", component: KidDashboardComponent, canActivate: [AuthGuard]},
    { path: "kid-profile", component: KidProfileComponent, canActivate: [AuthGuard]},
    { path: "kid-moment", component: KidMomentComponent, canActivate: [AuthGuard]},
    { path: "kid-edit-moment", component: KidEditMomentComponent, canActivate: [AuthGuard]},
    { path: "kid-notes", component: KidNotesComponent, canActivate: [AuthGuard]},
    { path: "kid-notes-edit", component: KidNotesEditComponent, canActivate: [AuthGuard]},
    { path: "kid-forms-and-docs", component: FormsAndDocumentsComponent, canActivate: [AuthGuard]},
    { path: "kid-reminders", component: KidRemindersComponent, canActivate: [AuthGuard]},
    { path: "kid-form-or-doc-webview", component: FormOrDocWebviewComponent, canActivate: [AuthGuard]},
    { path: "messages", component: MessagesComponent, canActivate: [AuthGuard]},
    { path: "settings", component: SettingsPage, canActivate: [AuthGuard]},
    { path: "change-password", component: ChangePasswordComponent, canActivate: [AuthGuard]},
    { path: "myschool", component: MySchoolComponent, canActivate: [AuthGuard]},
    { path: "post-hearters", component: HeartersComponent, canActivate: [AuthGuard]},
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
    ModalPostComment,
    ModalMessageToParent,
    ModalServerError,
    ForgotPasswordComponent,
    KidMomentComponent,
    KidEditMomentComponent,
    KidNotesComponent,
    KidNotesEditComponent,
    FormsAndDocumentsComponent,
    FormOrDocWebviewComponent,
    KidRemindersComponent,
    MessagesComponent,
    HeartersComponent,
    ChangePasswordComponent,
    MySchoolComponent

];

export const authProviders = [
    AuthGuard
];
