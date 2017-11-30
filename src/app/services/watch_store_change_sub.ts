// 此服务包含了组件中监听store变化的subscribe
import {Injectable} from '@angular/core';
import {
  SaveDataToServerApiInterface, QueryDataConflictFromServerRequestApi, QueryDataConflictFromServerResponseApi,
  SaveDateToServerContentInterface
} from '../api';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {RepairHistoryCollectStoreInterface} from '../repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';

import {get_csrf_token, convert_a_HH_mm_like_string_to_a_moment} from '../util_func';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class RepairDataPostToServerService {

  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar) {
  }

  public post_data_to_services() {
    Observable.of(null).withLatestFrom(this.store.select(state => state.repair_history_collect)).subscribe(
      (value: [null, RepairHistoryCollectStoreInterface]) => {
        const state = value[1];
        const query_data: QueryDataConflictFromServerRequestApi = {data: {date: []}};
        for (const i of state.repair_plan_and_history_sorted_by_date) {
          query_data.data.date.push(i.date.format('YYYYMMDD'));
        }
        // 浏览器端检测数据是否完整
        this.http.post<QueryDataConflictFromServerResponseApi>('api/data/check-repair-conflict-date',
          query_data
          ,
          {
            withCredentials: true,
            headers: {'X-CSRFToken': get_csrf_token()}
          }
        ).subscribe(
          (v) => {
            const post_data: SaveDataToServerApiInterface = {data: []};
            for (const date_data of state.repair_plan_and_history_sorted_by_date) {
              const this_date_data: SaveDateToServerContentInterface[] = [];
              const date = date_data.date;
              for (const single_data of date_data.repair_plan_data_index_on_this_day) {
                const plan_data = state.repair_plan_data[single_data.plan_number_id];
                const history_data = state.repair_history_data[single_data.history_number_id];
                const detail_data = state.repair_detail_data[single_data.history_number_id];
                this_date_data.push(
                  {
                    actual_end_number: detail_data ? detail_data.actual_end_number : '',
                    actual_end_time: detail_data.actual_end_time,
                    actual_start_time: detail_data.actual_start_time,
                    plan_end_time: convert_a_HH_mm_like_string_to_a_moment(plan_data.end_time, date),
                    plan_start_time: convert_a_HH_mm_like_string_to_a_moment(plan_data.start_time, date),
                    actual_start_number: detail_data ? detail_data.actual_start_number : '',
                    canceled: detail_data ? detail_data.canceled : false,
                    manual: history_data.use_paper,
                    person: detail_data ? detail_data.actual_watcher : '',
                    number: history_data.number
                  }
                );
              }
              post_data.data.push(
                {
                  date: date.format('YYYY-MM-DD'),
                  contents: this_date_data
                }
              );
            }
            this.http.post('api/data/post-repair-data/',
              post_data,
              {
                withCredentials: true,
                headers: {'X-CSRFToken': get_csrf_token()}
              }
            )
              .subscribe(v1 => console.log(v1));
          }, (error) => {
            this.snack_bar.open('oppppps，出错了', '朕知道了', {duration: 3000});
          },
        );
      }
    );
  }

}
