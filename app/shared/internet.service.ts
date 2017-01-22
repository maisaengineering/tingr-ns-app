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
                console.log("No connection");
                break;
            case connectivity.connectionType.wifi:
                console.log("WiFi connection");
                break;
            case connectivity.connectionType.mobile:
                console.log("Mobile connection");
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