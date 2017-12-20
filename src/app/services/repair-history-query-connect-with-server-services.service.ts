import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {RepairHistoryQueryGetDataListApi} from '../reapir-history-query/api';
import {
  RepairHistoryQueryDetailDataInterface,
  RepairHistoryQueryStoreActions as actions,
  RepairHistoryQueryStoreInterface, RepairHistoryQueryWholeDayDetailDataInterface
} from '../reapir-history-query/store/repair-history-query.store';
import * as moment from 'moment';

@Injectable()
export class RepairHistoryQueryConnectWithServerService {

  constructor(public httpClient: HttpClient,
              public store: Store<AppState>) {
  }

  public get_repair_history_data_from_server(start_time: moment.Moment, end_time: moment.Moment) {
    const url = '/api/data/get-repair-data/';
    this.httpClient.get(url, {
      withCredentials: true, params: {
        'start': start_time.format('YYYYMMDD'),
        'end': end_time.format('YYYYMMDD'),
      }
    }).subscribe((json: RepairHistoryQueryGetDataListApi) => {
      const data_sorted: RepairHistoryQueryWholeDayDetailDataInterface[] = [];
      const data_list: RepairHistoryQueryDetailDataInterface[] = [];
      for (const i of json.data) {
        for (const j of i.contents) {
          console.log(j.plan_start_time);
          data_list.push({
            ...j,
            plan_start_time: j.plan_start_time ? moment(j.plan_start_time) : null,
            plan_end_time: j.plan_end_time ? moment(j.plan_end_time) : null,
            actual_start_time: j.actual_start_time ? moment(j.actual_start_time) : null,
            actual_end_time: j.actual_end_time ? moment(j.actual_end_time) : null,
            date: moment(j.date)
          });
          const index = data_sorted.findIndex(value => value.date === i.date);
          index >= 0 ? data_sorted[index].contents.push(data_list.length - 1) : data_sorted.push({
            date: i.date,
            contents: [data_list.length - 1]
          });
        }
      }
      this.store.dispatch(new actions.UpdateAllRepairData({data: {contents: data_list, sorted_by_date: data_sorted}}));
    });
  }

}
