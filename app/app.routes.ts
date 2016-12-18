import {SettingsPage} from "./pages/settings/settings.page";
import {TodoPage} from "./pages/todo/todo.page";
import {HomePage} from "./pages/home/home.page";
import {DrawerComponent} from "./components/drawer/drawer.component";
import {TodoListComponent} from "./components/todolist/todo.list.component";
import { LoginPage } from "./pages/login/login.page";
import { VerifyPasswordPage } from "./pages/verify-password/password.page";
import { CalendarComponent } from "./pages/calendar/calendar.component";

import { AuthGuard } from "./auth-guard.service";

export const APP_ROUTES = [
    {path: "", redirectTo: "/calendar", pathMatch: 'full'},
    //{ path: "", component: CalendarComponent },
    {path: "home", component: HomePage},
    {path: "calendar", component: CalendarComponent},
    {path: "todo", component: TodoPage},
    {path: "settings", component: SettingsPage},
    { path: "verify-password", component: VerifyPasswordPage },
    { path: "login", component: LoginPage },
];

export const navigatableComponents = [
    LoginPage,
    VerifyPasswordPage,
    HomePage,
    SettingsPage,
    TodoPage,
    DrawerComponent,
    TodoListComponent,
    CalendarComponent
];

export const authProviders = [
    AuthGuard
];
