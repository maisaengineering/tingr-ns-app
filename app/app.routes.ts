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

import { AuthGuard } from "./auth-guard.service";
import { ModalDatePicker } from "./pages/dialogs/modal-date-picker";

export const APP_ROUTES = [

    { path: "", redirectTo: "/myclass", pathMatch: 'full'},
    { path: "calendar", component: CalendarComponent, canActivate: [AuthGuard] },
    { path: "myclass", component: MyClassComponent, canActivate: [AuthGuard] },
    { path: "kid-dashboard", component: KidDashboardComponent, canActivate: [AuthGuard]},
    { path: "kid-profile", component: KidProfileComponent, canActivate: [AuthGuard]},
    { path: "kid-documents", component: KidDocumentsComponent, canActivate: [AuthGuard]},
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
    KidDocumentsComponent

];

export const authProviders = [
    AuthGuard
];
