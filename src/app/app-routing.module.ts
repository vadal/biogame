import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "new-game", loadChildren: "~/app/new-game/new-game.module#NewGameModule" },
    { path: "history", loadChildren: "~/app/history/history.module#HistoryModule" },
    { path: "settings", loadChildren: "~/app/settings/settings.module#SettingsModule" },
    { path: "login", component: LoginComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

