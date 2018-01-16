import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'renderShowedTimeWithGivenMoment'
})
export class RenderShowedTimeWithGivenMomentPipe implements PipeTransform {

  transform(value: moment.Moment, args1: moment.Moment, args2 = 'time'): string {
    if (moment.isMoment(value) && moment.isMoment(args1)) {
      if (args2 === 'time') {
        return `${value.format('HH:mm')}-${args1.format('HH:mm')}`;
      } else if (args2 === 'long') {
        return args1.diff(value, 'minutes') + '分钟';
      }
    }
    return '未指明';

  }
}
