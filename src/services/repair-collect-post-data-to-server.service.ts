import {Injectable} from '@angular/core';
import {
  SaveDataToServerApiInterface,
  QueryDataConflictFromServerRequestApiInterface,
  QueryDataConflictFromServerResponseApiInterface,
  SaveDateToServerDataApiInterface
} from '../app/api';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../app/store';
import {RepairHistoryCollectStoreInterface} from '../app/repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';

import {
  get_csrf_token,
  convert_a_HH_mm_like_string_to_a_moment, get_obj_from_array_by_id
} from '../app/util_func';
import {MatSnackBar} from '@angular/material';
import {SnackBarConfig} from '../providers/snack-bar-provider';
import {check_a_plan_history_detail_group_data_is_valid} from '../app/repair-history-collect/repair_collect_data_utils';

@Injectable()
export class RepairDataPostToServerService {
  // 本服务包含将编辑的数据储存在服务器上的方法，主要为三个方法
  // 验证数据的有效性，从服务器上检测是否存在冲突日期，上传数据
  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar,
              public snack_bar_config: SnackBarConfig,) {
  }

  public check_data_is_valid() {
    this.store.select(state => state.repair_history_collect).take(1).subscribe(value => {
      for (const i of value.repair_plan_and_history_data_mapped) {
        if (i.repair_history_data_not_map_in_plan.length > 0) {
          this.snack_bar.open(`${i.date.format('YYYY-MM-DD')}的数据有误`, ...this.snack_bar_config as any);
          return false;
        }
        for (const mapped of i.repair_plan_data_index_on_this_day) {
          const plan_data = get_obj_from_array_by_id(value.repair_plan_data, mapped.plan_number_id).obj;
          const history_data = get_obj_from_array_by_id(value.repair_history_data, mapped.history_number_id).obj;
          const detail_data = get_obj_from_array_by_id(value.repair_detail_data, mapped.history_number_id).obj;
          const checked = check_a_plan_history_detail_group_data_is_valid(plan_data, history_data, detail_data);
          if (checked.valid) {
          } else {
            this.snack_bar.open(checked.error, ...this.snack_bar_config as any);
            return false;
          }
          if (detail_data && history_data && plan_data) {
          } else {
            return false;
          }
        }
      }
    });
  }

  public post_data_to_services() {
    Observable.of(null).withLatestFrom(this.store.select(state => state.repair_history_collect)).subscribe(
      (value: [null, RepairHistoryCollectStoreInterface]) => {
        const state = value[1];
        const query_data: QueryDataConflictFromServerRequestApiInterface = {data: {date: []}};
        for (const i of state.repair_plan_and_history_data_mapped) {
          query_data.data.date.push(i.date.format('YYYYMMDD'));
        }
        if (!this.check_data_is_valid()) {
          return;
        }
        // 浏览器端检测数据是否完整
        this.http.post<QueryDataConflictFromServerResponseApiInterface>('api/data/check-repair-conflict-date',
          query_data
          ,
          {
            withCredentials: true,
            headers: {'X-CSRFToken': get_csrf_token()}
          }
        ).subscribe(
          (v) => {
            const post_data: SaveDataToServerApiInterface = {data: []};
            for (const date_data of state.repair_plan_and_history_data_mapped) {
              const this_date_data: SaveDateToServerDataApiInterface[] = [];
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
                console.log(this_date_data);
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
