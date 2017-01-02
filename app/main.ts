// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {platformNativeScriptDynamic} from "nativescript-angular/platform";
import {AppModule} from "./app.module";
import {StatusBar} from "./utils/native";

// enable production mode...
import {enableProdMode} from '@angular/core';
enableProdMode();


StatusBar.setColor('#388e3c');

platformNativeScriptDynamic().bootstrapModule(AppModule);

