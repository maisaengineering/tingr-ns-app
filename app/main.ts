// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { AppModule } from "./app.module";
import {StatusBar} from "./utils/native";

import {isAndroid, isIOS} from "platform";
import firebase = require("nativescript-plugin-firebase");
// enable production mode...
import {enableProdMode} from '@angular/core';
enableProdMode();



/*
// to check if its production
import { environment } from './environments/environment';
// then if environment.production ..

if (environment.production) {
    enableProdMode();
}
*/

//StatusBar.setColor('#ffffff');
// Android doesn't ask permissions so go for firebase initialization on launch.
if (isAndroid) {
    firebase.init({
        // Optionally pass in properties for database, authentication and cloud messaging,
        // see their respective docs.
    }).then(
        (instance) => {
            console.log("-----------------  android firebase.init done");
        },
        (e) => {
            console.log("Failed to init firebase. " + e);
            console.log("stack:\n" + e.stack);
        }
    );
}



platformNativeScriptDynamic().bootstrapModule(AppModule);

