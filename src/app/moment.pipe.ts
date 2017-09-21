import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: moment.Moment, args = 'YYYY年MM月DD日'): string {
    return value.format(args);
  }

}
