import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {
  RepairHistoryCollectStoreActions,
  RepairHistoryCollectStoreInterface
} from '../repair-history-collect/repair-history-collect.store';
import {RepairHistoryDataApiInterface, RepairPlanApi} from '../api';
import {SnackBarConfig} from '../providers/snack-bar-provider';
import {MatSnackBar} from '@angular/material';
import {convert_history_data_server_to_store, convert_plan_data_server_to_store} from '../repair-history-collect/repair_collect_data_utils';

@Injectable()
export class RepairCollectGetDataFromServerService {
  public repair_collect_store: Observable<RepairHistoryCollectStoreInterface>;

  constructor(public http_client: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar,
              public snack_bar_config: SnackBarConfig,) {
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
      this.http_client.get(url, {withCredentials: true}).subscribe((v: RepairPlanApi) => {
        const json = v;
        // 模拟数据
        // json = JSON.parse(mock_repair_data);
        const data_list = [];
        for (const single_data of json.data) {
          data_list.push(convert_plan_data_server_to_store(single_data));
          this.store.dispatch(new RepairHistoryCollectStoreActions.ReplaceAllRepairData(
            {
              data: data_list
            }));
        }
        this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(false));
      });
    } else {
      this.snack_bar.open('日期选择错误', '朕知道了', this.snack_bar_config);
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
      this.http_client.get(url).do(() => this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(true)))
        .subscribe(
          (v: RepairHistoryDataApiInterface) => {
            let json: RepairHistoryDataApiInterface = v;
            // json = JSON.parse(mock_history_data);
            // 模拟数据
            const data_list = [];
            for (const single_data of json.data) {
              data_list.push(convert_history_data_server_to_store(single_data));
            }
            this.store.dispatch(new RepairHistoryCollectStoreActions.ReplaceAllHistoryData(
              {
                data: data_list
              }));
            this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchGetHistoryDataPending(false));
          });
    } else {
      this.snack_bar.open('日期选择错误', '朕知道了', this.snack_bar_config);
    }

  }
}

