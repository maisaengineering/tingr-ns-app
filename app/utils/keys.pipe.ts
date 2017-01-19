/* author: Upender
* 09/Jan/2017
* A Custom angular 2 Pipe to iterate over through key value pairs of JSON Object
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
@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
    transform(value, args:string[]) : any {
        if (!value) {
            return value;
        }
        let keys = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}