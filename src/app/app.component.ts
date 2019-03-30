import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import { User } from './models/user.model';
const firebase = require("nativescript-plugin-firebase");

import { AndroidApplication, AndroidActivityBackPressedEventData, iOSApplication } from "application";
import { isAndroid, isIOS } from "platform";

import { FirebaseService } from './services/firebase.service';

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;

    user: User;
    
    constructor(private router: Router, private routerExtensions: RouterExtensions, private firebaseService: FirebaseService) {
        // Use the component constructor to inject services.
        this.user = new User();
    }

    async ngOnInit() {
        try {
            await firebase.init({
              persist: false
            });
            console.log(">>>>> Firebase initialized");
        } catch (err) {
            console.log(">>>>> Firebase init error: " + err);
        }

        this.router.events.subscribe((val: any) => {
            if(!this.user.email) {
                this.firebaseService.getUser().then((user: any) => {
                    this.user = user;

                    const sideDrawer = <RadSideDrawer>app.getRootView();
                    if(user && user.email) {
                        // console.log('here?')
                        this.router.navigate(['/home']);
                        if(sideDrawer) sideDrawer.gesturesEnabled = true;
                    } else {
                        // console.log('disable ==========')
                        sideDrawer.gesturesEnabled = false;
                    }

                });
            }
        } )
        
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
    }

    ngAfterViewInit() {
        // use setTimeout otherwise there is no getRootView valid reference
        setTimeout(() => {
            if(!this.user || !this.user.email) { 
                const drawer = <RadSideDrawer>app.getRootView();
                drawer.gesturesEnabled = false;
            }
        }, 100);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        console.log(this.onNavItemTap)
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    logout() {
        this.firebaseService.logout().then((res: any) => {
            if(isAndroid) {
                app.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                    data.cancel = true; // prevents default back button behavior
                });
            } else if(isIOS) {
                //
            }
              this.router.navigate(['/login']);

                const sideDrawer = <RadSideDrawer>app.getRootView();
                sideDrawer.closeDrawer();
                sideDrawer.gesturesEnabled = false;
        })
    }
}
