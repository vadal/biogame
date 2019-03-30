import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";

import { Page } from "tns-core-modules/ui/page";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { setNumber } from "tns-core-modules/application-settings";
import { GridLayout, ItemSpec, GridUnitType } from "ui/layouts/grid-layout";
import { setTimeout } from "timer";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ModalComponent } from "../modal/modal.component";
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: "Quiz",
    moduleId: module.id,
    templateUrl: "./quiz.component.html"
})
export class QuizComponent implements OnInit {

    difficulty: any;
    chapter: any;

    questions: Array<any> = [];
    quiz: Array<any> = [];


    currentQuestionIndex: number = 0;
    score: number = 0;
    wrongs: boolean = false;

    constructor(private page: Page, private firebaseService: FirebaseService, private router: Router, private route: ActivatedRoute, private modalService: ModalDialogService, private viewContainerRef: ViewContainerRef,
        private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        // console.log(this.route.queryParamMap.subscribe)
        let item;
        this.route.queryParams.subscribe(params => {
            // console.log(this.route.snapshot.queryParams)
            if(params['wrongs']) {
                this.wrongs = true;
                this.chapter = 0;
                this.difficulty = 0;

            } else {
                this.chapter = params['chapter'];
                this.difficulty = params['difficulty'];
            } 
                this.firebaseService.getQuiz(this.difficulty, this.chapter, null).then((snapshot: any) => {
                    // console.log(snapshot)
                    let docs = snapshot.docs ? snapshot.docs : snapshot;
                    docs = this._shuffle(docs);
                    docs = docs.slice(0, 10);
                    docs.forEach((doc: any) => {
                        item = doc.data();
                        item.id = doc.id;
                        this.questions.push(item);
                    });
                })
            
        })
    }

    private _shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    // -------------------------- QUIZ ----------------------------

    selectAnswer(answerIndex: number, args: any) {
        this.questions[this.currentQuestionIndex].selected = answerIndex;
        let option = <GridLayout>args.object;
        
        if (this.questions[this.currentQuestionIndex].correctAnswerIndex == answerIndex) {
            // correct answer
            this.score += 1;
            option.backgroundColor = '#4caf50';
            this.quiz.push({
                question: this.questions[this.currentQuestionIndex].id,
                answer: answerIndex,
                correct: true
            });
            setTimeout(
                () => {
                    this.nextQuestion();
                }, 1000)
        }
        else {
            // wrong answer
            this.quiz.push({
                question: this.questions[this.currentQuestionIndex].id,
                answer: answerIndex
            });
            option.backgroundColor = '#ed1111';
            //save to server
            this.showModal(this.currentQuestionIndex);
            this.firebaseService.setWrongAnswer(this.questions[this.currentQuestionIndex].id, answerIndex);
        }

    }

    nextQuestion() {
        if (this.currentQuestionIndex == this.questions.length - 1) {
            this.end();
        }
        else {
            this.currentQuestionIndex += 1;
        }
    }

    saveScore() {
        let scorePercentage = Math.round(this.score * 100 / this.questions.length);
        this.firebaseService.setResults(this.quiz, this.chapter, this.difficulty, scorePercentage).then(res => {
            console.log(res)
            this.navigateToScore(res.id);
        });
    }

    end() {
        this.saveScore();
    }

    // ------------------------- NAVIGATION -----------------------------

    navigateToScore(id) {
        this.routerExtensions.navigate(["/history/"+id]);
    }

    navigateToPrevious() {
        this.routerExtensions.backToPreviousPage();
    }

    showModal(i) {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false,
            context: {
                icon: '',
                title: 'ΛΑΘΟΣ ΑΠΑΝΤΗΣΗ',
                intro: this.questions[i].intro,
                right: 'ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ',
                explanation: this.questions[i].options[this.questions[i].correctAnswerIndex],
                btnText: 'OK'
            }
        };
        this.modalService.showModal(ModalComponent, options).then(res => {
            this.nextQuestion();
        });
    }

}
