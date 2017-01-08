import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../shared/config";
import { TokenService } from "../shared/token.service";
import { TeacherInfo } from "../providers/data/teacher_info";

@Injectable()
export class PostService {

    constructor(private http: Http) {

    }

    getPosts(kl_id) {


        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "kid_posts",
            body: {
                last_modified: "",
                post_count: 0,
                step: "next",
                paginate:true,
                profile_id: kl_id
            }
        });

        return this.http.post(
            Config.apiUrl + "posts", data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors)


    }


    addOrRemoveHeart(post, hearted){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: hearted ? "remove_heart" : "add_heart",
            body: {}
        });

        return this.http.post(
            Config.apiUrl + "posts/"+post.kl_id, data, {
                headers: headers
            }
        ).map((res:Response) => res.json())
            .catch(this.handleErrors)
    }



    handleErrors(error: any)  {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }
}

export interface Post {
    kl_id: string,
    slug: string,
    title: string,
    tzone: string,
    scope: string,
    text: string,
    text_with_tags: string,
    height: string,
    weight: string,
    untag: boolean,
    author_name: string,
    photograph: string, // author photograph
    image: string, // post thumbnail image onlclick show large image
    large_image: string, // post thumbnail image onlclick show large image
    personality: boolean,
    fb_url: string,
    created_at: string,
    post_type: string,
    deletable: boolean,
    can_delete: boolean,
    can_edit: boolean,
    can_save: boolean,
    kid_birthdate: string,
    hearted: boolean,
    heart_icon: string,
    hearts_count: number,
    asset_base_url: string, // combine with heart_icon if clicks on bottom
    tags: Array<any>,
    comments: Array<Comment>,
    tagged_to: Array<TaggedTo>,
}
export interface Comment {
    commented_by: string,
    slug: string,
    created_at: string,
    commenter_photo: string,
    content: string,
    unknown_commenter: boolean,
    child_name: string,
    child_relationship: string
}

export interface TaggedTo {
    kl_id: string,
    short_name: string,
    nickname: string,
    photograph: string,
    fname: string,
    lname: boolean
}
