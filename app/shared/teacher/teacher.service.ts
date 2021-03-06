import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Teacher } from "./teacher";
import { Config } from "../config";
import { TokenService } from "../token.service";
import { TeacherInfo } from "../../providers/data/teacher_info";

@Injectable()
export class TeacherService {
    constructor(private http: Http,private teacherInfo: TeacherInfo) {}

    signIn(teacher: Teacher) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "authentication",
            body: {
                user_email: teacher.email,
                password: teacher.password,
                remember_me: true
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }


    logOff() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "revoke_authentication",
            body: {}
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }

    forgotPassword(email) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "forgot_password",
            body: {
                email: email
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    evaluteUser(teacher: Teacher) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "evaluate_user",
            body: {
                email: teacher.email
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    updatePassword(currentPassword,newPassword,confirmPassword){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "change_password",
            body: {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    mySchoolInfo(){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "school_info",
            body: { }
        });
        return this.http.post(
            Config.apiUrl + "teachers", data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    changePhotoGraph(imageBase64Data, teacher_klid){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let imageBase64DataWithFormat = "data:image/jpeg;base64," + imageBase64Data;
        let imageFileName = new Date().getTime() + '.jpeg';
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "change_photograph",
            body: {
                profile_id: teacher_klid,
                name: imageFileName,
                content_type: "image/jpeg",
                content: imageBase64DataWithFormat
            }
        });
        return this.http.post(
            Config.apiUrl + "document-vault", data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }

    profileDetails(teacher_klid){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "teacher_info",
            body: {
            }
        });
        return this.http.post(
            Config.apiUrl + "profiles/"+teacher_klid, data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }


    updateProfile(info,teacher_klid){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "update_teacher",
            body: {
                fname: info.fname,
                lname: info.lname
            }
        });
        return this.http.post(
            Config.apiUrl + "profiles/"+teacher_klid, data, {
                headers: headers
            }
        )
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }


    handleErrors(error: Response) {
        // return Observable.throw(error.json() || {error: 'Server error'})
        return Observable.throw(error.json() || {error: 'Server error'})
    }


}