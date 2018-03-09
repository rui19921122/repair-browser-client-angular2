import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppState} from '../app/store';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {
  RepairDataInterface,
  RepairHistoryCollectStoreActions,
  RepairHistoryCollectStoreInterface
} from '../app/repair-history-collect/repair-history-collect.store';
import {
  RepairHistoryApiInterface,
  RepairPlanApiInterface,
  RepairPlanDataApiInterface
} from '../app/api';
import {SnackBarConfig} from '../providers/snack-bar-provider';
import {MatSnackBar} from '@angular/material';
import {
  convert_history_data_server_to_store, convert_history_server_data_to_store_data,
  convert_plan_data_server_to_store
} from '../app/repair-history-collect/repair_collect_data_utils';
import {mock_history_data, mock_repair_data} from '../app/repair-history-collect/mock-data';
import {generate_a_id, get_obj_from_array_by_id} from '../app/util_func';
import {UseMockData} from '../providers/use-mock-data-provider';

@Injectable()
export class RepairCollectGetBaseDataFromServerService {
  public repair_collect_store: Observable<RepairHistoryCollectStoreInterface>;
  private get_repair_history_data_sub_func = {
    next: (v: RepairHistoryApiInterface) => {
      const json: RepairHistoryApiInterface = v;
      const data_list: RepairDataInterface[] = [];
      for (const origin of json.data) {
        const converted_data = convert_history_server_data_to_store_data(origin, data_list);
        if (converted_data) {
          data_list.push(converted_data);
        }
      }
      this.store.dispatch(new RepairHistoryCollectStoreActions.UpdateWholeRepairData(
        {
          data: data_list
        }));
      this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchGetHistoryDataPending(false));
    }
  };
  private get_repair_plan_data_sub_func = {
    next: (json: RepairPlanApiInterface) => {
      const data_list: RepairDataInterface[] = [];
      // for (const single_data of json.data) {
      //   data_list.push(convert_plan_data_server_to_store(single_data));
      // }
      this.store.dispatch(new RepairHistoryCollectStoreActions.UpdateWholeRepairData(
        {
          data: data_list
        }));
      this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(false));
    }
  };

  constructor(public http_client: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar,
              public snack_bar_config: SnackBarConfig,
              public use_mock_data: UseMockData) {
    this.repair_collect_store = this.store.select(state => state.repair_history_collect);
  }

  public get_repair_plan_data_from_server() {
    let state;
    this.repair_collect_store.subscribe(value => {
      state = value;
    }).unsubscribe();
    if (state.start_date && state.end_date && state.start_date.isSameOrBefore(state.end_date)) {
      const url = `/api/scrapy/plan/plan/?start_date` +
        `=${state.start_date.format('YYYY-MM-DD')}&end_date=${state.end_date.format('YYYY-MM-DD')}`;
      this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(true));
      if (this.use_mock_data) {
        Observable.of(JSON.parse(mock_repair_data)).delay(3000).subscribe(this.get_repair_plan_data_sub_func as any);
      } else {
        this.http_client.get(url, {withCredentials: true}).subscribe(this.get_repair_plan_data_sub_func);
      }
    } else {
      this.snack_bar.open('日期选择错误', ...this.snack_bar_config as any);
    }
  }

  public get_repair_history_data_from_server() {
    let state;
    this.repair_collect_store.subscribe(value => {
      state = value;
    });
    if (state.start_date && state.end_date && state.start_date.isSameOrBefore(state.end_date)) {
      this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(true));
      const url = `/api/scrapy/history-list/repair/?start` +
        `=${state.start_date.format('YYYYMMDD')}&end=${state.end_date.format('YYYYMMDD')}`;
      if (this.use_mock_data) {
        Observable.of(JSON.parse(mock_history_data))
          .do(() => {
            this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(true));
          })
          .delay(3000)
          .subscribe(
            this.get_repair_history_data_sub_func as any
          );
      } else {
        this.http_client.get(url, {withCredentials: true})
          .do(() => {
            this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(true));
          })
          .subscribe(
            this.get_repair_history_data_sub_func
          );
      }
    } else {
      this.snack_bar.open('日期选择错误', ...this.snack_bar_config as any);
    }

  }

  public calc_miss_repair_plan_data_by_history_data() {
    function generate_plan_number_from_history_number(str: string): { number: string, type: 'Ⅰ' | 'Ⅱ' | '站' | '垂' } {
      const slitted = str.split('-');
      if (slitted.length !== 2) {
        throw Error(`${str}无法按-切分`);
      }
      return {
        number: slitted[1].slice(1, slitted[1].length),
        type: slitted[1][0] === 'J' ? 'Ⅱ' : (slitted[1][0] === 'Z' ? '站' : '垂')
      };
    }

    let current_state: RepairHistoryCollectStoreInterface;
    this.repair_collect_store.subscribe(v => current_state = v).unsubscribe();
    const repair_plan_data = Array.from(current_state.repair_plan_data);
    for (const single_date of current_state.repair_plan_and_history_data_mapped) {
      const miss_repair_history_data_id_list = single_date.repair_history_data_not_map_in_plan;
      for (const repair_history_id of miss_repair_history_data_id_list) {
        const history_detail = get_obj_from_array_by_id(current_state.repair_history_data, repair_history_id).obj;
        const number_and_type = generate_plan_number_from_history_number(history_detail.number);
        const repair_plan_like_data: RepairPlanDataApiInterface = {
          number: number_and_type.number,
          post_date: history_detail.date.format(),
          apply_place: history_detail.apply_place,
          area: '',
          direction: '',
          plan_time: history_detail.plan_time,
          type: number_and_type.type,
          content: []
        };
        // repair_plan_data.push(convert_plan_data_server_to_store(repair_plan_like_data));
      }
    }
    // this.store.dispatch(new RepairHistoryCollectStoreActions.ReplaceAllRepairData({data: repair_plan_data}));
  }


}

