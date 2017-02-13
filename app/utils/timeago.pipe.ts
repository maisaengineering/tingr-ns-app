import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
@Pipe({
    name: 'timeAgo',
    pure: false
})
export class TimeAgoPipe implements PipeTransform {
    transform(date: Date, args: any[]) {
        //moment.utc(date, 'MM/DD/YYYY HH:mma Z').fromNow();
       return moment(date).fromNow();
    }
}