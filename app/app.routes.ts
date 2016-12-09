import {SettingsPage} from "./pages/settings/settings.page";
import {TodoPage} from "./pages/todo/todo.page";
import {HomePage} from "./pages/home/home.page";
import {DrawerComponent} from "./components/drawer/drawer.component";
import {TodoListComponent} from "./components/todolist/todo.list.component";
import { LoginPage } from "./pages/login/login.page";
import { VerifyPasswordPage } from "./pages/verify-password/password.page";

export const APP_ROUTES = [
    //{path: "", redirectTo: "/home", pathMatch: 'full'},
    { path: "", component: LoginPage },
    {path: "home", component: HomePage},
    {path: "todo", component: TodoPage},
    {path: "settings", component: SettingsPage},
    { path: "verify-password", component: VerifyPasswordPage },
];

export const navigatableComponents = [
    LoginPage,
    VerifyPasswordPage,
    HomePage,
    SettingsPage,
    TodoPage,
    DrawerComponent,
    TodoListComponent,
];