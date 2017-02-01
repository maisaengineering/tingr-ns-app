import {Component, ViewContainerRef, OnInit, NgModule, Input} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {ModalDialogService, ModalDialogOptions, ModalDialogHost} from "nativescript-angular/modal-dialog";
import {DatePicker} from "ui/date-picker";
import {Page} from "ui/page";
import {Router, NavigationExtras} from "@angular/router";
import {PostService} from "../../shared/post.service";
import {ServerErrorService} from "../../shared/server.error.service";
let tnsfx = require('nativescript-effects');
let view = require("ui/core/view");
let app = require("application");

@Component({
    selector: 'modal-content',
    providers: [ PostService, ServerErrorService ],
    template: ` 
      <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: white; border-radius: 10;"> 
         <StackLayout class="m-x-20 m-t-10" verticalALignment="center"> 
            <Gridlayout cols="auto,auto" verticalAlignment="center"> 
              <Label row="0" col="0" text="Add Comment" class="action-label" horizontalAlignment="center"></Label> 
              <StackLayout  row="0" col="1"   (tap)="close('close')" class="text-primary blue2" horizontalAlignment="right" orientation="horizontal">  
                <Label text="&#xE5CD;" class="text-left material-icons md-36 md-close"></Label>
              </StackLayout> 
            </Gridlayout>  
         </StackLayout>
         <StackLayout class="hr-shadow m-5"></StackLayout>
         <StackLayout orientation="vertical">
              <GridLayout rows="200,auto, auto">
                 <CardView row="0" margin="5 10 5 12" radius="10" elevation="10"  class="whiteCard">
                    <TextView  style="color: black;" verticalAlignment="stretch" borderColor="white"
                      hint="enter your comment here..." id="message-text"
                      class="input-without-border-bottom message-text"
                      text="" [(ngModel)]="commentDescription" editable="true"> 
                    </TextView> 
                  </CardView> 
                  <StackLayout row="1" orientation="vertical"> 
                      <StackLayout id="errorLabel">
                          <Label *ngIf="inputError" visibility="{{ commentDescription ? 'collapse' : 'visible' }}" text="can't be blank" margin="5 10 5 12" class="error-label"></Label>
                       </StackLayout> 
                     <Button width="200" text="Send"  isEnabled="{{ isLoading ? false : true }}"
                        class="btn btn-primary blue2-background btn-rounded-sm" (tap)="submit('submit')"></Button>     
                     <ActivityIndicator visibility="{{ isLoading ? 'visible' : 'collapsed'}}" class="busy activity-indicator"
                               busy="{{isAndroid ? true : false }}"></ActivityIndicator>             
                  </StackLayout>     
              </GridLayout>  
         </StackLayout> 
       </StackLayout>
    `
})
export class ModalPostComment implements OnInit {
    @Input() public post_kl_id: string;
    @Input() public post_slug: string;
    @Input() public commentDescription: string;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public inputError: Boolean = false;

    constructor(private params: ModalDialogParams,
                private page: Page,
                private postService: PostService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }

        this.commentDescription = '';
        //console.log("ModalContent.constructor: " + JSON.stringify(params));
        this.post_kl_id = params.context.post_kl_id;
        this.post_slug = params.context.post_slug;
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

    public submit(res: string) {
        //console.log("Passing Data :" + this.commentDescription);
        //this.params.closeCallback(res);
        let description = this.commentDescription.trim();
        if(description){
            this.isLoading = true;
            this.postService.addComment(this.post_slug, description)
                .subscribe(
                    (result) => {
                        this.isLoading = false;
                        this.params.closeCallback(result.body);
                    },
                    (error) => {
                        this.isLoading = false;
                        this.params.closeCallback('close');
                        this.serverErrorService.showErrorModal();
                    }
                );
        }else{
            this.inputError = true;
            let errorLabel = view.getViewById(this.page, 'errorLabel');
            errorLabel.floatIn('fast', 'right');
            //this.params.closeCallback('close');
        }
    }


    ngOnInit() {
        //console.log("ModalContent.ngOnInit");
    }

    ngOnDestroy() {
        //console.log("ModalContent.ngOnDestroy");
    }
}