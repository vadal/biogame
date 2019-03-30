import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

import { FirebaseService } from '../services/firebase.service';
import * as moment from 'moment';

@Component({
    selector: "History",
    moduleId: module.id,
    templateUrl: "./history.component.html",
    styleUrls: ["./history.component.css"],
    providers: [
        { provide: 'moment', useFactory: (): any => moment }
    ]
})
export class HistoryComponent implements OnInit {
    items: Array<any> = [];
    constructor(private page: Page, private firebaseService: FirebaseService, public router: Router) {
        // Use the component constructor to inject providers.
        this.page.enableSwipeBackNavigation = false;
        moment.locale('el');
    }

    ngOnInit(): void {
        // Init your component properties here.
        let item;
        this.firebaseService.getHistory().then(querySnapshot => {
            querySnapshot.forEach((doc: any) => {
                if(doc.exists) {
                    item = doc.data();
                    item.ddate = moment(item.date);
                    item.date = moment(item.date).fromNow();
                    item.id = doc.id;
                    item.score = parseInt(item.score);
                    this.items.push(item);
                }
            });
            if(this.items[this.items.length - 1]) this.items[this.items.length - 1].last = true;
            this.items.sort((a, b) => b.ddate - a.ddate);
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
