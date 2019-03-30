import * as firebase from 'nativescript-plugin-firebase';

import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/user.model';
import { equalPath } from '@angular/router/src/url_tree';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()

export class FirebaseService {
    constructor(private ngZone: NgZone) {}

    register(user: User) {
        return firebase.createUser({
            email: user.email,
            password: user.password
        });
    }

    login(user: User) {
        return firebase.login({
            type: firebase.LoginType.PASSWORD,
            passwordOptions: {
                email: user.email,
                password: user.password
            }
        });
    }

    getUser() {
        return firebase.getCurrentUser();
    }

    logout() {
        return firebase.logout();
    }

    getDifficulties() {
        return firebase.firestore.collection('difficulties').orderBy('key','asc').get();
    }

    getChapters() {
        return firebase.firestore.collection('chapters').orderBy('key','asc').get();
    }

    async getQuiz(difficulty, chapter, wrongs) {
        if(wrongs) {
            let questions = [];
            await this.getUser().then(user => {
                if(user.uid) {
                    firebase.firestore.collection('wrongAnswers').where("user", "==" , user.uid).get().then(doc => {
                        doc.forEach(d => {
                            firebase.firestore.collection('questions').doc(d.data().question).get().then(q => {
                                questions.push(q);
                            })
                        })
                    })
                }
            });
            return questions;
        } else if(difficulty > 0 && chapter > 0) {
            return firebase.firestore.collection('questions').where("difficulty", "==" , parseInt(difficulty)).where("chapter", "==", parseInt(chapter)).get()
        } else if (difficulty > 0) {
            return firebase.firestore.collection('questions').where("difficulty", "==" , parseInt(difficulty)).limit(10).get();
        } else if (chapter > 0) {
            return firebase.firestore.collection('questions').where("chapter", "==", parseInt(chapter)).limit(10).get();
        } else {
            return firebase.firestore.collection('questions').limit(10).get();
        }
    }

    setWrongAnswer(question, answer) {
        //check if already exists
        return this.getUser().then(user => {
            if(user.uid) {
                firebase.firestore.collection('wrongAnswers').where('user', '==', user.uid).where('question', '==', question).get().then(snapshot => {
                    if(snapshot.docs.length == 0) {
                        firebase.firestore.collection('wrongAnswers').doc().set({
                            user: user.uid,
                            question: question,
                            answer: answer
                        });
                    }
                });
            }
        });
    }

    async setResults(results, chapter, difficulty, score) {
        let res;
        await this.getUser().then(user => {
            if(user.uid) {
                for(var i = 0, len = results.length; i < len; i++) {
                    if(results[i].correct) {
                        firebase.firestore.collection('wrongAnswers').where('user', '==', user.uid).where('question', '==', results[i].question).get().then(snapshot => {
                            snapshot.forEach(snap => {
                                firebase.firestore.collection('wrongAnswers').doc(snap.id).delete();
                            })
                        });
                    }
                }
                
                return firebase.firestore.collection('quizResults').add({
                    user: user.uid,
                    chapter: chapter,
                    difficulty: difficulty,
                    score: score,
                    results: results,
                    date: new Date().toISOString()
                }).then(doc => {
                    res = doc;
                });
            }
        });
        return res;
    }
    
    getHistory() {
        return this.getUser().then(user => {
            if(user.uid) {
                return firebase.firestore.collection('quizResults').where('user', '==', user.uid).limit(10).get();
            }
        });
    }

    getQuestions(questions) {
        for(var i = 0, len = questions.length; i < len; i++) {
            (function(i) {
                firebase.firestore.collection('questions').doc(questions[i].question).get().then((q: any) => {
                    q = q.data();
                    questions[i].question = q.question;
                    if(q.correctAnswerIndex != questions[i].answer) questions[i].correctAnswer = q.options[q.correctAnswerIndex];
                    questions[i].answer = q.options[questions[i].answer];
                });
            })(i);
        }

        return questions;
    }

    getResultsById(id) {
        let results;
        return firebase.firestore.collection('quizResults').doc(id).get().then(async doc => {
            if(doc.exists) {
                results = doc.data();
                results.results = await this.getQuestions(results.results);
                
                await firebase.firestore.collection('difficulties').where('key', '==', parseInt(results.difficulty)).get().then((d: any) => {
                    d.forEach((dc: any) => {
                        results.difficultyDisplay = dc.data().display;
                    })
                });

                await firebase.firestore.collection('chapters').where('key', '==', parseInt(results.chapter)).get().then((c: any) => {
                    c.forEach((cc: any) => {
                        results.chapterDisplay = cc.data().display;
                    })
                });

                return results;
                
            }
        });
    }

    toDate(date) {
        console.log(date)
        return date.toDate();
    }
}