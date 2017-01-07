import {SettingsPage} from "./pages/settings/settings.page";
import {TodoPage} from "./pages/todo/todo.page";
//import {HomeComponent} from "./pages/home/home.component";
import {DrawerComponent} from "./components/drawer/drawer.component";
import {TodoListComponent} from "./components/todolist/todo.list.component";
import { LoginPage } from "./pages/login/login.page";
import { ForgotPasswordComponent } from "./pages/login/forgot-password.component";
import { VerifyPasswordPage } from "./pages/verify-password/password.page";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { MyClassComponent } from "./pages/myclass/myclass.component";
import { KidDashboardComponent } from "./pages/kid-dashboard/kid-dashboard-component";

import { AuthGuard } from "./auth-guard.service";
import { ModalDatePicker } from "./pages/dialogs/modal-date-picker";
import { LogoutComponent } from "./pages/login/logout.component";

export const APP_ROUTES = [

    {path: "", redirectTo: "/myclass", pathMatch: 'full'},
    {path: "calendar", component: CalendarComponent, canActivate: [AuthGuard] },
    {path: "myclass", component: MyClassComponent, canActivate: [AuthGuard] },
    {path: "kid-dashboard", component: KidDashboardComponent, canActivate: [AuthGuard]},
    {path: "todo", component: TodoPage},
    {path: "settings", component: SettingsPage},
    { path: "verify-password", component: VerifyPasswordPage },
    { path: "login", component: LoginPage },
    { path: "logout", component: LogoutComponent, canActivate: [AuthGuard] },
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
    TodoPage,
    DrawerComponent,
    TodoListComponent,
    CalendarComponent,
    MyClassComponent,
    KidDashboardComponent,
    ModalDatePicker,
    LogoutComponent,
    ForgotPasswordComponent

];

export const authProviders = [
    AuthGuard
];
