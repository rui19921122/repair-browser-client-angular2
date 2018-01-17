import {Pipe, PipeTransform} from '@angular/core';
import {RepairPlanAndHistoryDataMappedInterface} from '../app/repair-history-collect/repair-history-collect.store';
import * as moment from 'moment';

@Pipe({
  name: 'filterSelectedDateFromMappedList'
})
export class FilterSelectedDateFromMappedListPipe implements PipeTransform {

  transform(data: RepairPlanAndHistoryDataMappedInterface[],
            show: moment.Moment,
            not_show: moment.Moment[],
            display_one: boolean): RepairPlanAndHistoryDataMappedInterface[] {
    if (display_one) {
      if (show) {
        return data.filter(value => value.date.isSame(show));
      } else {
        return data[0] ? [data[0]] : [];
      }
    } else {
      return data.filter(value => not_show.findIndex(value2 => value2.isSame(value.date)) < 0);
    }
  }

}
