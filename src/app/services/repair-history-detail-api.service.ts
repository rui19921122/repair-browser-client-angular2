import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {
  RepairHistoryCollectStoreActions as actions,
  RepairHistorySingleDataInterface
} from '../repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {string_is_a_valid_time, convert_a_HH_mm_like_string_to_a_moment, get_obj_from_array_by_id} from '../util_func';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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
  public loading_subject = new BehaviorSubject<string[]>([]);

  constructor(public http: HttpClient, public store: Store<AppState>) {
    this.loading_subject.subscribe((value) => {
      if (value.length === 0) {
        return;
      }
      // 获取需要处理的id
      const current = value[0];
      let inner_id;
      let date;
      this.store.select(state => get_obj_from_array_by_id(state.repair_history_collect.repair_history_data, current).obj).subscribe(
        value2 => {
          inner_id = value2.inner_id;
          date = value2.date;
        }
      ).unsubscribe();
      const url = '/api/scrapy/history-detail/detail/' + inner_id;
      const sub = this.http.get(url, {withCredentials: true}).publish();
      sub.connect();
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
                longing: actual_end_time.diff(actual_start_time, 'minutes')
              }
            }
          ));
        }, () => {
        },
        () => {
          this.loading_subject.next(value.slice(1, value.length));
        }
      );
    });
  }


  public get_history_detail_by_id(value: RepairHistorySingleDataInterface) {
    if (value.use_paper) {
      return Observable.of(1);
    } else {
      let list = [];
      this.loading_subject.subscribe(value2 => {
        list = value2;
        list.push(value.id);
      }).unsubscribe();
      this.loading_subject.next(list);
    }
  }

}
