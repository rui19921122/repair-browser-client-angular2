// 此服务包含了组件中监听store变化的subscribe
import {Injectable} from '@angular/core';
import {
  SaveDataToServerApiInterface, QueryDataConflictFromServerRequestApi, QueryDataConflictFromServerResponseApi,
  SaveDateToServerContentInterface
} from '../api';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {
  RepairHistoryCollectStoreInterface, RepairHistorySingleDataInterface, RepairPlanAndHistoryDataSorted,
  RepairPlanSingleDataInterface,
  RepairHistoryCollectStoreActions as actions
} from '../repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';

import {get_csrf_token, convert_a_HH_mm_like_string_to_a_moment} from '../util_func';
import {MatSnackBar} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class RepairDataPostToServerService {
  public watcher_for_plan_and_history_data_map: Subscription;
  public store_observable: Observable<AppState>;

  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar) {
    this.store_observable = this.store.select(state => state);
  }

  public watch_for_plan_and_history_data_map(bool: boolean) {
    if (bool) {
      // 开始监控
    } else {
      if (this.watcher_for_plan_and_history_data_map) {
        this.watcher_for_plan_and_history_data_map.unsubscribe();
      }
    }
  }

  public refresh_plan_and_history_data_map_by_hand() {
    Observable.of(null).withLatestFrom(this.store_observable).subscribe(
      value => {
        this.store.dispatch(new actions.MapPlanAndHistoryNumber({
          data: this.map_plan_and_history_data(
            value[1].repair_history_collect.repair_plan_data,
            value[1].repair_history_collect.repair_history_data,
            value[1].repair_history_collect.repair_plan_and_history_data_mapped
          )
        }));
      }
    );
  }

  private map_plan_and_history_data(plan_data: RepairPlanSingleDataInterface[],
                                    history_data: RepairHistorySingleDataInterface[],
                                    prev_state?: RepairHistoryCollectStoreInterface): RepairPlanAndHistoryDataSorted[] {
    // 首先找出人为标注的部分
    // 先找出所有日期
    const date_list: RepairPlanAndHistoryDataSorted[] = [];
    // 遍历计划数据，并按日期进行分类，将单个计划添加到列表中
    for (const single_plan_data of plan_data) {
      const date_index_in_date_list = date_list.findIndex(value => value.date.isSame(single_plan_data.date));
      const push_data = {
        plan_number_id: single_plan_data.id,
        is_manual: false,
        history_number_id: null
      };
      if (date_index_in_date_list < 0) {
        date_list.push({
          date: single_plan_data.date,
          repair_history_data_not_map_in_plan: [],
          repair_plan_data_index_on_this_day: [
            push_data
          ]
        });
      } else {
        date_list[date_index_in_date_list].repair_plan_data_index_on_this_day.push(
          push_data
        );
      }
    }
    for (const single_history_data of history_data) {
      const date_index_in_date_list = date_list.findIndex(value => value.date.isSame(single_history_data.date));
      // 遍历历史数据，并按ID进行匹配，将数据插入其中
      if (date_index_in_date_list < 0) {
        date_list.push(
          {
            repair_plan_data_index_on_this_day: [],
            repair_history_data_not_map_in_plan: [single_history_data.id],
            date: single_history_data.date
          }
        );
      } else {
        const today_data = date_list[date_index_in_date_list];
        let found = false;
        for (const plan_data_collection of today_data.repair_plan_data_index_on_this_day) {
          const plan_data_detail = plan_data.find(value => value.id === plan_data_collection.plan_number_id);
          if (plan_data_detail.used_number === single_history_data.used_number) {
            plan_data_collection.history_number_id = single_history_data.id;
            found = true;
            break;
          }
        }
        if (!found) {
          today_data.repair_history_data_not_map_in_plan.push(single_history_data.id);
        }
      }
    }
    return date_list;

  }


}
