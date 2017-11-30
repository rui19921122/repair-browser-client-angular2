import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'diffTimeWithStringFormat'
})
export class DiffTimeWithStringFormatPipe implements PipeTransform {

  transform(value: string, value2: string, format = 'HH:mm'): any {
    return moment(value, format).diff(moment(value2, format), 'minutes');
  }

}
