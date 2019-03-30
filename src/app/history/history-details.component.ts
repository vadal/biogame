import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: "HistoryDetails",
    moduleId: module.id,
    templateUrl: "./history-details.component.html",
    styleUrls: ["./history-details.component.css"]
})
export class HistoryDetailsComponent implements OnInit {
    results: any;
    subscription: any;

    constructor(private page: Page, private firebaseService: FirebaseService, public router: Router, public route: ActivatedRoute) {
        // Use the component constructor to inject providers.
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.subscription = this.route.params.subscribe(params => {
            this.firebaseService.getResultsById(params['id']).then(results => {
                this.results = results;
                // console.log(this.results)
            });
        })
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    ngOnDestroy() {
        if(this.subscription) this.subscription.unsubscribe();
    }
}
