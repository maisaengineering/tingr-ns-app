import {Injectable} from "@angular/core";
var connectivity = require("connectivity");
var dialogs = require("ui/dialogs");

@Injectable()
export class InternetService {
    public connectionType = connectivity.getConnectionType();

    constructor() {

    }

    checkConnectionType() {
        switch (this.connectionType) {
            case connectivity.connectionType.none:
                break;
            case connectivity.connectionType.wifi:
                break;
            case connectivity.connectionType.mobile:
                break;
        }
    }


    alertIfOffline(){
        switch (this.connectionType) {
            case connectivity.connectionType.none:
                dialogs.alert({
                    title: "Internet connection required",
                    message: "Your credits could not be updated.\n" +
                    "Please make sure you are connected to the internet.",
                    okButtonText: "OK"
                }).then(() => {
                    //console.log("Dialog closed!");
                });
                break;
        }
    }

}