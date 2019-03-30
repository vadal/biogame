import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

import { SelectedIndexChangedEventData, ValueList } from "nativescript-drop-down";

import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: "NewGame",
    moduleId: module.id,
    templateUrl: "./new-game.component.html",
    styleUrls: ["./new-game.component.css"]
})
export class NewGameComponent implements OnInit {
    listPickerDifficulty: ValueList<string> = new ValueList<string>();
    listPickerChapter: ValueList<any> = new ValueList<any>();
    selectedListPickerDifficultyIndex: number;
    selectedListPickerChapterIndex: number;
    difficultyContent: any;
    chapterContent: any;
    constructor(private page: Page, private firebaseService: FirebaseService, public router: Router) {
        // Use the component constructor to inject providers.
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.firebaseService.getDifficulties().then(querySnapshot => {
            querySnapshot.forEach((doc: any) => {
                if(doc.exists) {
                    doc = doc.data();
                    this.listPickerDifficulty.push({value: doc.key, display: doc.display});
                }
            });
        });

        this.firebaseService.getChapters().then(querySnapshot => {
            querySnapshot.forEach((doc: any) => {
                if(doc.exists) {
                    doc = doc.data();
                    this.listPickerChapter.push({value: doc.key, display: doc.display});
                }
            });
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onGoTap() {
        
        this.router.navigate(['/new-game/quiz'], { 
            queryParams: { 
                page: 1,
                difficulty: this.listPickerDifficulty.getValue(this.selectedListPickerDifficultyIndex) != undefined ? this.listPickerDifficulty.getValue(this.selectedListPickerDifficultyIndex) : null, 
                chapter: this.listPickerChapter.getValue(this.selectedListPickerChapterIndex) != undefined ? this.listPickerChapter.getValue(this.selectedListPickerChapterIndex) : null
            } 
        } );
    }

    selectedIndexChange(e: SelectedIndexChangedEventData, a) {
        console.log(`Drop Down selected index changed from ${e.oldIndex} to ${e.newIndex}. New value is "${this.listPickerDifficulty.getValue(
            e.newIndex)}"`);
            console.log(1)
    }

    public onopen() {
        console.log("Drop Down opened.");
    }

    public onclose() {
        console.log("Drop Down closed.");
    }
}
