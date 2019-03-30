import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { connectionType, getConnectionType } from "connectivity";

import { Page } from "tns-core-modules/ui/page";

import { User } from "../models/user.model";
import { FirebaseService } from "../services/firebase.service";

@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoggingIn = true;
    user: User;
    processing = false;
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(private page: Page, private firebaseService: FirebaseService, private router: Router) {
        this.page.actionBarHidden = true;
        this.user = new User();
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    submit() {
        if (!this.user.email || !this.user.password) {
            this.alert("Συμπλήρωσε το e-mail και τον κωδικό σου.");
            return;
        }

        this.processing = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        if (getConnectionType() === connectionType.none) {
            alert("Για να συνδεθείς απαιτείται η χρήση internet.");
            return;
        }
        this.firebaseService.login(this.user)
            .then((res) => {
                this.processing = false;
                if(this.user)
                    this.router.navigate(["/home"]);
            })

            .catch((e) => {
                console.log(e)
                
                this.processing = false;
                this.alert("Δε βρήκαμε το λογαριασμό σου. Μήπως έγραψες λάθος τα στοιχεία;");
                this.router.navigate(["/home"]);
            });
    }

    register() {
        if (getConnectionType() === connectionType.none) {
            alert("Για να συνδεθείς απαιτείται η χρήση internet.");
            return;
        }
        if (this.user.password != this.user.confirmPassword) {
            this.alert("Οι κωδικοί δεν ταιριάζουν.");
            return;
        }
        this.firebaseService.register(this.user)
            .then(() => {
                this.processing = false;
                this.alert("Ο λογαριασμός σου δημιουργήθηκε!");
                this.isLoggingIn = true;
            })
            .catch(() => {
                this.processing = false;
                this.alert("Δυστυχώς δεν μπορέσαμε να δημιουργήσουμε το λογαριασμό σου.");
            });
    }

    forgotPassword() {
        prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register for APP NAME to reset your password.",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then((data) => {
            if (data.result) {
                /*this.firebaseService.resetPassword(data.text.trim())
                    .then(() => {
                        this.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                    }).catch(() => {
                        this.alert("Unfortunately, an error occurred resetting your password.");
                    });*/
            }
        });
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPassword.nativeElement.focus();
        }
    }

    alert(message: string) {
        return alert({
            title: "APP NAME",
            okButtonText: "OK",
            message: message
        });
    }
}

