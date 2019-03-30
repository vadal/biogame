import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular";
import { HistoryRoutingModule } from "./history-routing.module";
import { HistoryComponent } from "./history.component";
import { HistoryDetailsComponent } from './history-details.component';

import { ProgressBarComponent } from '../shared/progress-bar.component'

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HistoryRoutingModule,
        NativeScriptUIChartModule,
        NativeScriptUIGaugeModule
    ],
    declarations: [
        HistoryComponent,
        HistoryDetailsComponent,
        ProgressBarComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HistoryModule { }
