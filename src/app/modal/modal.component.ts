import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    selector: "modal",
    template: `
    <ScrollView>
		<StackLayout class="p-20">
            <!--<GridLayout columns="auto,auto" rows="auto">
                <Label text="&#xe5c9;" class="fa" col="0" row="0">
                </Label>
                <Label class="" col="1" row="0" color="#ed1111" [text]="params.context.title" textWrap="true"></Label>
            </GridLayout>-->
            <Label class="modal-title" color="#ed1111" [text]="params.context.title" textWrap="true"></Label>
            <Label class="" [text]="params.context.intro" textWrap="true"></Label>
            <Label class="modal-right" color="#4caf50" [text]="params.context.right" textWrap="true"></Label>
            <Label class="" [text]="params.context.explanation" textWrap="true"></Label>
            <Button class="btn raised-button text-right" [text]="params.context.btnText" (tap)="close()"></Button>
        </StackLayout>
    </ScrollView>
	`,
    styles: [`
        :host {
            font-size: 20px;
        }
        .modal-title {
            margin-bottom: 15px;
            font-size: 20px;
        }
        .modal-right {
            margin: 25px 0 15px;
        }
        .raised-button {
            background: none;
            box-shadow: 0;
            border: 0;
            outline: 0;
            padding: 10px;
            margin: 0;
            z-index: 0;
            color: #4caf50;
        }
    `]
})
export class ModalComponent implements OnInit {

    constructor(private params: ModalDialogParams) { }

    ngOnInit() { }

    close() {
        this.params.closeCallback();
    }
}

