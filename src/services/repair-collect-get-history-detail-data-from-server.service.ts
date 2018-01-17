import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AppState} from '../app/store';
import {Store} from '@ngrx/store';
import {
  RepairHistoryCollectStoreActions as actions,
  RepairHistoryDataStoreInterface
} from '../app/repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {string_is_a_valid_time, convert_a_HH_mm_like_string_to_a_moment, get_obj_from_array_by_id} from '../app/util_func';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SnackBarConfig} from '../providers/snack-bar-provider';
import {MatSnackBar, MatSnackBarRef} from '@angular/material';
import {CountingMappedPlanDataWithoutHistoryPipe} from '../pipes/counting-mapped-plan-data-without-history.pipe';

export interface RepairHistoryDetailAPIInterface {
  actual_host_person: string;
  actual_start_time: string;
  publish_start_number: string;
  number: string;
  actual_end_time: string;
  effect_area: string;
  repair_content: string;
  actual_end_number: string;
  publish_start_time: string;
}

@Injectable()
export class RepairHistoryDetailApiService {
  public loading_subject = new BehaviorSubject<Set<string>>(new Set());
  public loading: boolean;

  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar_config: SnackBarConfig,
              public snack_bar: MatSnackBar) {
    this.loading_subject.subscribe((value) => {
      // 获取需要处理的id
      if (value.size === 0) {
        return;
      }
      if (this.loading) {
        return;
      }
      const current = value.values().next().value;
      let inner_id;
      let date;
      this.store.select(state => get_obj_from_array_by_id(state.repair_history_collect.repair_history_data, current).obj).subscribe(
        value2 => {
          inner_id = value2.inner_id;
          date = value2.date;
        }
      ).unsubscribe();
      const url = '/api/scrapy/history-detail/detail/' + inner_id;
      this.loading = true;
      const sub = this.http.get(url, {withCredentials: true}).share();
      sub.subscribe(
        (response: RepairHistoryDetailAPIInterface) => {
          const json: RepairHistoryDetailAPIInterface = response;
          let actual_start_time: moment.Moment;
          let actual_end_time: moment.Moment;
          if (json.actual_start_time && string_is_a_valid_time(json.actual_start_time)) {
            actual_start_time = convert_a_HH_mm_like_string_to_a_moment(json.actual_start_time, date);
          }
          if (json.actual_end_time && string_is_a_valid_time(json.actual_end_time)) {
            actual_end_time = convert_a_HH_mm_like_string_to_a_moment(json.actual_end_time, date);
          }
          this.store.dispatch(new actions.UpdateSingleRepairHistoryDetailData(
            {
              id: current,
              value: {
                actual_end_time: actual_end_time,
                actual_start_time: actual_start_time,
                actual_start_number: json.publish_start_number,
                actual_end_number: json.actual_end_number,
                actual_watcher: json.actual_host_person,
                update_time: moment(),
                canceled: false,
                id: current,
                longing: actual_end_time.diff(actual_start_time, 'minutes'),
                note: ''
              }
            }
          ));
        }, () => {
          this.snack_bar.open(`获取${current}详情错误`, ...this.snack_bar_config as any);
          const next_value = this.loading_subject.getValue();
          this.loading = false;
          next_value.delete(current);
          this.loading_subject.next(next_value);
        },
        () => {
          const next_value = this.loading_subject.getValue();
          this.loading = false;
          next_value.delete(current);
          this.loading_subject.next(next_value);
        }
      );
    });
  }


  public get_history_detail_by_id(value: RepairHistoryDataStoreInterface) {
    if (value.use_paper) {
      return Observable.of(1);
    } else {
      let list: Set<string> = new Set();
      this.loading_subject.subscribe(value2 => {
        list = value2;
        list.add(value.id);
      }).unsubscribe();
      this.loading_subject.next(list);
    }
  }

}
