import { ItemEventData } from "ui/list-view"
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GridLayout } from "ui/layouts/grid-layout";
import { Page } from "ui/page";
import { screen } from "platform";
import { isIOS } from "platform";
import { ScrollEventData } from "tns-core-modules/ui/scroll-view";
import { PanGestureEventData, GestureStateTypes, GestureEventData } from "ui/gestures";
import { setTimeout, clearInterval } from "timer";
import { registerElement } from "nativescript-angular/element-registry";
import { AnimationCurve } from "ui/enums";
import { RouterExtensions } from 'nativescript-angular/router';
import { Router } from "@angular/router";

declare const UITableViewCellSelectionStyle;

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    @ViewChild('image', { read: ElementRef }) imageContainer: ElementRef;
    onButtonTap(): void {
    }
    constructor(private page: Page, private router: Router) {
        page.actionBarHidden = true;
    }

    ngOnInit(): void {
    }

    get minHeight() {
        return screen.mainScreen.heightDIPs - this.imageContainer.nativeElement.offsetHeight;
    }

    navigateToWrongs() {
        let navigationExtras = {
            queryParams: {
                'wrongs': true
            }
        };
        this.router.navigate(["/new-game/quiz"], navigationExtras);
    }
}
