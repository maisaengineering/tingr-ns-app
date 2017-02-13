import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortName'
})
export class ShortNamePipe implements PipeTransform {
    transform(person: any, args: any[]) {
        if(person.fname && person.lname){
            return person.fname[0]+''+person.lname[0];
        }else if(person.nickname){
            return person.nickname[0];
        }else if(person.sender_name){
            let n = person.sender_name.split(' ');
            let name = n[0][0];
            if(n[1]){
                name += n[1][0]
            }
            return name;
        }else if(person.commented_by){
            let n = person.commented_by.split(' ');
            let name = n[0][0];
            if(n[1]){
                name += n[1][0]
            }
            return name;
        }else{
            return '';
        }
    }
}