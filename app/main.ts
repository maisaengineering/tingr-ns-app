// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { AppModule } from "./app.module";
import {StatusBar} from "./utils/native";

// enable production mode...
import {enableProdMode} from '@angular/core';
//enableProdMode();

// to check if its production
// require 'environment'
// then if environment.production ..


//StatusBar.setColor('#ffffff');

import firebase = require("nativescript-plugin-firebase");
firebase.init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
}).then(
    (instance) => {
        console.log("-----------------  firebase.init done");
    },
    (error) => {
        console.log("-----------------  firebase.init error: " + error);
    }
); 


platformNativeScriptDynamic().bootstrapModule(AppModule);

