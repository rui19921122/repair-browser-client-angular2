import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'inTheMomentList'
})
export class InTheMomentListPipe implements PipeTransform {

  transform(value: moment.Moment, args: moment.Moment[]): any {
    for (const i of args) {
      if (i.isSame(value)) {
        return true;
      }
    }
    return false;
  }

}
