import {Component, ViewContainerRef, OnInit, NgModule, Input} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {Page} from "ui/page";
import {MessageService} from "../../shared/message.service";
import {ServerErrorService} from "../../shared/server.error.service";
let tnsfx = require('nativescript-effects');
let view = require("ui/core/view");

let app = require("application");

@Component({
    selector: 'modal-content',
    providers: [ MessageService, ServerErrorService ],
    template: ` 
       <StackLayout sdkExampleTitle sdkToggleNavButton style="background-color: white;"> 
         <StackLayout class="m-x-20 m-t-10" verticalALignment="center"> 
            <Gridlayout cols="auto,auto" verticalAlignment="center"> 
              <Label row="0" col="0" text="Message" class="action-label" horizontalAlignment="center"></Label> 
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
                      hint="enter your message here..." id="message-text"
                      class="input-without-border-bottom message-text"
                      text="" [(ngModel)]="messageText" editable="true"> 
                    </TextView> 
                  </CardView> 
                  <StackLayout row="1" orientation="vertical"> 
                      <StackLayout id="errorLabel">
                          <Label *ngIf="inputError"  visibility="{{ messageText ? 'collapse' : 'visible' }}"text="can't be blank" margin="5 10 5 12" class="error-label"></Label>
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
export class ModalMessageToParent implements OnInit {
    @Input() public kid_kl_id: string;
    @Input() public messageText: string;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public inputError: Boolean = false;

    constructor(private params: ModalDialogParams,
                private page: Page,
                private messageService: MessageService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
        this.messageText = '';
        //console.log("ModalContent.constructor: " + JSON.stringify(params));
        this.kid_kl_id = params.context.kid_kl_id;
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

    public submit(res: string) {
        //this.params.closeCallback(res);
        let description = this.messageText.trim();
        if(description){
            this.isLoading = true;
            this.messageService.sendMessage(description, this.kid_kl_id)
                .subscribe(
                    (result) => {
                        this.isLoading = false;
                        this.params.closeCallback(result);
                    },
                    (error) => {
                        this.isLoading = false;
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