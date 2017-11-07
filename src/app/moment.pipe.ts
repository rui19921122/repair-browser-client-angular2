import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: moment.Moment | Date, args = 'YYYY年MM月DD日'): string {
    if (moment.isMoment(value)) {
      return value.format(args);
    } else {
      return moment(value).format(args);
    }
  }

}
