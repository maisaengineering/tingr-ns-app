import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {Config} from "../shared/config";
import {TokenService} from "../shared/token.service";
import {TeacherInfo} from "../providers/data/teacher_info";
import {DatePipe} from '@angular/common';

@Injectable()
export class PostService {

    constructor(private http: Http, private datePipe: DatePipe) {

    }

    getPosts(postCount = 0, lastModified = '', kl_id) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "kid_posts",
            body: {
                last_modified: lastModified,
                post_count: postCount,
                step: "next",
                paginate: true,
                profile_id: kl_id
            }
        });

        return this.http.post(
            Config.apiUrl + "posts", data, {
                headers: headers
            }
        )


    }


    addOrRemoveHeart(post, hearted) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: hearted ? "remove_heart" : "add_heart",
            body: {}
        });

        return this.http.post(
            Config.apiUrl + "posts/" + post.kl_id, data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }

    uploadToS3(imageBase64Data) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let imageBase64DataWithFormat = "data:image/jpeg;base64," + imageBase64Data;
        let imageFileName = new Date().getTime() + '.jpeg';
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: 'upload_to_s3',
            body: {
                name: imageFileName,
                content_type: "image/jpeg",
                content: imageBase64DataWithFormat
            }
        });

        return this.http.post(
            Config.apiUrl + "posts", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }

    createPost(createdAt, additionalDetails, taggedKidIds, s3_key) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let postCreatedAt = this.datePipe.transform(createdAt, 'MM/dd/yyyy');
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: 'create_post',
            body: {
                date: this.datePipe.transform(createdAt, 'MM/dd/yyyy'),
                additional_text: additionalDetails,
                tags: taggedKidIds,
                img_keys: [s3_key],
                scope: "public",
                tzone: 'EST'
            }
        });
        return this.http.post(
            Config.apiUrl + "posts", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }


    updatePost(postKlId, updatedAt, additionalDetails, taggedKidIds, s3_key) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let postCreatedAt = this.datePipe.transform(updatedAt, 'MM/dd/yyyy');

        let body = {
            date: this.datePipe.transform(updatedAt, 'MM/dd/yyyy'),
            additional_text: additionalDetails,
            tags: taggedKidIds,
            img_keys: [s3_key],
            scope: "public",
            tzone: 'EST'
        };

        // send key in body if s3_key exists only
        if (s3_key) {
            body['key'] = s3_key;
        }

        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: 'update_post',
            body: body
        });
        return this.http.post(
            Config.apiUrl + "posts/" + postKlId, data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }

    deletePost(post) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: 'delete_post',
            body: {}
        });
        return this.http.post(
            Config.apiUrl + "posts/" + post.kl_id, data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }

    getHearters(post_kl_id) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: 'hearters',
            body: {}
        });
        return this.http.post(
            Config.apiUrl + "posts/" + post_kl_id, data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }

    addComment(post_slug, text) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: 'create',
            body: {
                post_slug: post_slug,
                text: text,
                scope: "public"
            }
        });
        return this.http.post(
            Config.apiUrl + "comments", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }


    handleErrors(error: any) {
        return Observable.throw(error.message || error);
    }


}

export class Post {
    public kl_id;
    public slug;
    public title;
    public tzone;
    public scope;
    public tags: any[];
    public text;
    public author_name;
    public photograph;
    public images: any[];
    public large_images: any[];
    public img_keys: any[];
    public created_at;
    public deletable;
    public can_delete;
    public can_edit;
    public can_save;
    public kid_birthdate;
    public  comments: Comment[] = new Array();
    public  tagged_to: TaggedTo[] = new Array();
    // tagged to
    public hearted;
    public heart_icon;
    public hearts_count;
    public asset_base_url;


    constructor(kl_id: string, slug: string, title: string, tzone: string,
                scope: string, text: string, author_name: string, photograph: string,
                created_at: string, deletable: boolean,
                can_delete: boolean, can_edit: boolean, can_save: boolean, kid_birthdate: string,
                hearted: boolean, heart_icon: string, hearts_count: number, asset_base_url: string) {
        this.kl_id = kl_id;
        this.slug = slug;
        this.title = title;
        this.tzone = tzone;
        this.scope = scope;
        this.tags = [];
        this.text = text;
        this.author_name = author_name;
        this.photograph = photograph;
        this.created_at = created_at;
        this.deletable = deletable;
        this.can_delete = can_delete;
        this.can_edit = can_edit;
        this.can_save = can_save;
        this.kid_birthdate = kid_birthdate;

        // comments
        // taagedTo
        this.hearted = hearted;
        this.heart_icon = heart_icon;
        this.hearts_count = hearts_count;
        this.asset_base_url = asset_base_url;

    }

}


export class DataItem {
    public name;
    public title;
    public text;
    public image;

    constructor(name: string, title: string, text: string, image: string) {
        this.name = name;
        this.text = text;
        this.title = title;
        this.image = image;
    }
}

export class Comment {
    public commented_by: string;
    public slug: string;
    public created_at: string;
    public child_name: string;
    public child_relationship: string;
    public commenter_photo: string;
    public content: string;
    public unknown_commenter: boolean;
    constructor(commented_by, slug, created_at, child_name, child_relationship, commenter_photo, content, unknown_commenter) {
        this.commented_by = commented_by;
        this.slug = slug;
        this.created_at = created_at;
        this.child_name = child_name;
        this.child_relationship = child_relationship;
        this.commenter_photo = commenter_photo;
        this.content = content;
        this.unknown_commenter = unknown_commenter;
    }
}

export class TaggedTo {
    public kl_id: string;
    public short_name: string;
    public nickname: string;
    public photograph: string;
    public fname: string;
    public lname: string;


    constructor(kl_id,short_name,nickname,photograph,fname,lname){
        this.kl_id = kl_id;
        this.short_name = short_name;
        this.nickname = nickname;
        this.photograph = photograph;
        this.fname = fname;
        this.lname = lname;
    }
}
