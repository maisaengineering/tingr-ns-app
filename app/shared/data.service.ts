import { Injectable } from "@angular/core";
import { getString, setString , setNumber, getNumber} from "application-settings";

//const tokenKey = "token";

export class DataService {

    static isLoggedIn(): boolean {
        return !!getString("token");
    }

    static get accessToken(): string {
        return getString("accessToken");
    }

    static set accessToken(str: string) {
        setString("accessToken", str);
    }


    static get accessTokenExpiry(): number {
        return getNumber("accessTokenExpiry");
    }

    static set accessTokenExpiry(num: number) {
        setNumber("accessTokenExpiry", num);
    }

    static get authToken(): string {
        return getString("authToken");
    }

    static set authToken(str: string) {
        setString("authToken", str);
    }
}