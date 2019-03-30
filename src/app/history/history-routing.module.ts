import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HistoryComponent } from "./history.component";
import { HistoryDetailsComponent } from "./history-details.component";

const routes: Routes = [
    { path: "", component: HistoryComponent },
    { path: ":id", component: HistoryDetailsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HistoryRoutingModule { }
