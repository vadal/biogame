import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { LoginComponent } from './login/login.component';
import { FirebaseService } from './services/firebase.service';

import { ModalComponent } from "./modal/modal.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        ModalComponent
    ],
    entryComponents: [ModalComponent],
    providers: [FirebaseService],
    schemas: [
        NO_ERRORS_SCHEMA

    ]
})

export class AppModule { }
