import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { DropDownModule } from "nativescript-drop-down/angular";
import { NewGameRoutingModule } from "./new-game-routing.module";
import { NewGameComponent } from "./new-game.component";
import { QuizComponent } from './quiz.component';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NewGameRoutingModule,
        DropDownModule
    ],
    declarations: [
        NewGameComponent,
        QuizComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class NewGameModule { }
