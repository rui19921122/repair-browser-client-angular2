import {Pipe, PipeTransform} from '@angular/core';
import {RepairPlanAndHistoryDataSorted} from '../repair-history-collect/repair-history-collect.store';
import * as _ from 'lodash';

@Pipe({
  name: 'countingMappedPlanDataWithoutHistory'
})
export class CountingMappedPlanDataWithoutHistoryPipe implements PipeTransform {

  transform(value: RepairPlanAndHistoryDataSorted['repair_plan_data_index_on_this_day'], args?: any): number {
    return value.filter(value2 => !value2.history_number_id).length;
  }

}
