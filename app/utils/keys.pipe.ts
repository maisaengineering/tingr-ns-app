/* author: Upender
* 09/Jan/2017
* A Custom angular 2 Pipe to iterate over through key value pairs of JSON Object
* And order by date
* Example:
* -------------
*
data = {
 "01/17/2017": [
 { name: 'Some Name1', age: '26'},
 { name: 'Some Name2', age: '27'}
 ],
 "01/18/2017": [
 { name: 'Some Name1', age: '26'},
 { name: 'Some Name1', age: '26'}
 ]
 }
 USAGE
 ----------
  import Pipe in @NgModule and add it in declarations
  then,
  *ngFor="let groupedData of data | keys "
  then, groupedData.key =>"01/17/2017"
        groupedData.value => [{ name: 'Some Name1', age: '26'}, { name: 'Some Name2', age: '27'}]
*
* */

import {Pipe, PipeTransform} from "@angular/core";
import * as moment from 'moment';
@Pipe({name: 'keys', pure: false})
export class KeysPipe implements PipeTransform {
    transform(value, args:string[]) : any {
        if (!value) {
            return value;
        }
        let keys = [];
        for (let key in value) {
            // convert string to date object
            let newKey = moment(key,'MM/DD/YYYY');
            keys.push({key: newKey, value: value[key]});
        }

        // let sort the object by date(key)
        let sortedKeys = keys.sort((a: any, b: any) => {
            let date1 = new Date(a.key);
            let date2 = new Date(b.key);
            if (date1 > date2) {
                return 1;
            } else if (date1 < date2) {
                return -1;
            } else {
                return 0;
            }
        });

        return sortedKeys;
    }
}