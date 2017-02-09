import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
@Pipe({
    name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
    transform(date: Date, args: any[]) {
        //12/25/2016 06:57am UTC
        return moment.utc(date, 'MM/DD/YYYY HH:mma').fromNow();
    }
}