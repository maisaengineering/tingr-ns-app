// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { AppModule } from "./app.module";
import {StatusBar} from "./utils/native";

// enable production mode...
import {enableProdMode} from '@angular/core';
enableProdMode();

// to check if its production
// require 'environment'
// then if environment.production ..


//StatusBar.setColor('#ffffff');

platformNativeScriptDynamic().bootstrapModule(AppModule);

