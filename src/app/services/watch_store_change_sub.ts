// 此服务包含了组件中监听store变化的subscribe
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {
  RepairHistoryCollectStoreInterface,
  RepairHistorySingleDataInterface,
  RepairPlanAndHistoryDataSorted,
  RepairPlanSingleDataInterface,
  RepairHistoryCollectStoreActions as actions
} from '../repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';

import {MatSnackBar} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {SnackBarConfig} from '../providers/snack-bar-provider';
import * as moment from 'moment';

@Injectable()
export class WatchStoreChangeService {
  public refresh_the_plan_and_history_map: Subject<null | moment.Moment> = new Subject();
  public store_observable: Observable<AppState>;
  public plan_and_history_observable: Observable<[RepairPlanSingleDataInterface[], RepairHistorySingleDataInterface[]]>;
  public watcher_the_plan_and_history_map: Subscription;

  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar,
              public snack_bar_config: SnackBarConfig) {
    this.store_observable = this.store.select(state => state);
    this.plan_and_history_observable = this.store.select(state => state.repair_history_collect.repair_plan_data)
      .combineLatest(this.store.select(state => state.repair_history_collect.repair_history_data));
    this.refresh_the_plan_and_history_map.withLatestFrom(this.store_observable).subscribe((value) => {
      const calc_value = this.map_plan_and_history_data(
        value[1].repair_history_collect.repair_plan_data,
        value[1].repair_history_collect.repair_history_data,
        value[1].repair_history_collect,
        value[0]
      );
      this.store.dispatch(new actions.MapPlanAndHistoryNumber({
        data: calc_value
      }));
    });
  }

  public watch_for_plan_and_history_data_map(bool: boolean) {
    if (bool) {
      // 开始自动监控
      this.watcher_the_plan_and_history_map = this.plan_and_history_observable.subscribe(value => {
        if (true) {
          console.log('由于计划或历史数据数据变化，触发了一次更新操作');
          this.refresh_the_plan_and_history_map.next(moment());
          // 当计划数据与历史数据如何变化时会触发更新操作
        }
      });
    } else {
      if (this.watcher_the_plan_and_history_map) {
        this.snack_bar.open('不再自动追踪数值变化', '朕知道了', this.snack_bar_config);
        this.watcher_the_plan_and_history_map.unsubscribe();
      }
    }
  }


  private map_plan_and_history_data(plan_data: RepairPlanSingleDataInterface[],
                                    history_data: RepairHistorySingleDataInterface[],
                                    prev_state?: RepairHistoryCollectStoreInterface,
                                    start_time?: moment.Moment): RepairPlanAndHistoryDataSorted[] {
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
          // 比对函数
          const plan_data_detail = plan_data.find(value => value.id === plan_data_collection.plan_number_id);
          if (plan_data_detail.used_number === single_history_data.number) {
            plan_data_collection.history_number_id = single_history_data.id;
            found = true;
            break;
          }
        }
        if (!found) {
          date_list[date_index_in_date_list].repair_history_data_not_map_in_plan.push(single_history_data.id);
        }
      }
    }
    if (start_time) {
      console.log(`本次更新操作耗时${moment().diff(start_time, 'millisecond')}毫秒`);
    }
    return date_list;

  }


}
