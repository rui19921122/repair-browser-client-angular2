import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {
  RepairHistoryCollectStoreActions, RepairHistoryCollectStoreInterface, RepairHistorySingleDataInterface,
  RepairPlanSingleDataInterface
} from './repair-history-collect.store';
import {MdSnackBar} from '@angular/material';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {Http} from '@angular/http';
import {RepairHistoryDataApiInterface, RepairPlanApi} from '../api';
import {Subject} from 'rxjs/Subject';

class ButtonType {
  text: string;
  type: 'length' | 'month';
  value: number;
}

@Component({
  selector: 'app-repair-history-collect',
  templateUrl: './repair-history-collect.component.html',
  styleUrls: ['./repair-history-collect.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepairHistoryCollectComponent implements OnInit {
  public page_height: number;
  public month_button_choices: [ButtonType, ButtonType];
  public length_button_choices: [ButtonType, ButtonType, ButtonType];
  public DatePickerForm: FormGroup;
  public is_login: Observable<boolean>;
  public $state: Observable<RepairHistoryCollectStoreInterface>;
  public search_for_plan_data = new Subject();
  public search_for_history_data = new Subject();


  constructor(public http: Http,
              public store: Store<AppState>,
              public ng_change: ChangeDetectorRef,
              public snack_bar: MdSnackBar,
              fb: FormBuilder) {
    this.$state = this.store.select(state2 => state2.repair_history_collect);
    this.search_for_plan_data
      .withLatestFrom(this.$state)
      .subscribe(([data, state]) => {
        if (state.start_date && state.end_date && state.start_date.isSameOrBefore(state.end_date)) {
          const url = `/api/scrapy/plan/plan/?start_date` +
            `=${state.start_date.format('YYYY-MM-DD')}&end_date=${state.end_date.format('YYYY-MM-DD')}`;
          this.store.dispatch(new RepairHistoryCollectStoreActions.switchPendingRepairPlan(true));
          this.http.get(url).subscribe(v => {
            const json: RepairPlanApi = v.json();
            const origin_date_map: RepairPlanSingleDataInterface[] = [];
            const sorted_date_map: { date: moment.Moment, repair_plan_data_index_on_this_day: number[] }[] = [];
            let id = 0;
            Observable.from(json.data)
              .map(e => {
                // 这一步将字符串格式的日期转换成了moment格式,其他的内容暂时不做转换
                return {...e, post_date: moment(e.post_date), id: id};
              }).subscribe(value => {
              const _sorted_date_index = sorted_date_map.findIndex(value2 => value.post_date.isSame(value2.date));
              if (_sorted_date_index < 0) {
                sorted_date_map.push({date: value.post_date, repair_plan_data_index_on_this_day: [value.id]});
              } else {
                sorted_date_map[_sorted_date_index].repair_plan_data_index_on_this_day.push(value.id);
              }
              origin_date_map.push(value);
              id += 1;
            }, () => {
            }, () => {
              this.store.dispatch(new RepairHistoryCollectStoreActions.updateSortedRepairPlanData(sorted_date_map));
              this.store.dispatch(new RepairHistoryCollectStoreActions.updateRepairData({data: origin_date_map}));
              this.store.dispatch(new RepairHistoryCollectStoreActions.switchPendingRepairPlan(false));
            });
          });
        } else {
          this.snack_bar.open('日期选择错误', 'X', {duration: 2000});
        }
      });
    this.search_for_history_data.withLatestFrom(this.$state)
      .subscribe(([data, state]) => {
          if (state.start_date && state.end_date && state.start_date.isSameOrBefore(state.end_date)) {
            this.store.dispatch(new RepairHistoryCollectStoreActions.switchPendingRepairPlan(true));
            const url = `/api/scrapy/history-list/repair/?start` +
              `=${state.start_date.format('YYYYMMDD')}&end=${state.end_date.format('YYYYMMDD')}`;
            this.http.get(url).do(() => this.store.dispatch(new RepairHistoryCollectStoreActions.switchPendingRepairPlan(true)))
              .subscribe(
                v => {
                  const json: RepairHistoryDataApiInterface = v.json();
                  const origin_date_map: RepairHistorySingleDataInterface[] = [];
                  const sorted_date_map: { date: moment.Moment, repair_history_data_index_on_this_day: number[] }[] = [];
                  let id = 0;
                  Observable.from(json.data)
                    .map(e => {
                      // 这一步将字符串格式的日期转换成了moment格式,其他的内容暂时不做转换
                      return {...e, date: moment(e.date), id: id};
                    }).subscribe(value => {
                      const _sorted_date_index = sorted_date_map.findIndex(value2 => value.date.isSame(value2.date));
                      if (_sorted_date_index < 0) {
                        sorted_date_map.push({date: value.date, repair_history_data_index_on_this_day: [value.id]});
                      } else {
                        sorted_date_map[_sorted_date_index].repair_history_data_index_on_this_day.push(value.id);
                      }
                      origin_date_map.push(value);
                      id += 1;
                    },
                    () => {
                    },
                    () => {
                      this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchGetHistoryDataPending(false));
                      this.store.dispatch(new RepairHistoryCollectStoreActions.UpdateSortedRepairHistoryData(sorted_date_map));
                      this.store.dispatch(new RepairHistoryCollectStoreActions.UpdateRepairHistoryData(origin_date_map));
                    });
                });
          }
          else {
            this.snack_bar.open('日期选择错误', 'X', {duration: 2000});
          }
        }
      );
    this.page_height = window.innerHeight - 52;
    this.is_login = this.store.select(state => state.user.is_login);
    this.length_button_choices = [
      {type: 'length', value: 0, text: '一天内'},
      {type: 'length', value: 7, text: '一周内'},
      {type: 'length', value: 30, text: '三十天内'},
    ];
    this.month_button_choices = [
      {type: 'month', value: 0, text: '本周'},
      {type: 'month', value: 1, text: '本月'},
      {type: 'month', value: 2, text: '上月'},
    ];
    let origin_start_date;
    let origin_end_date;
    this.$state.take(1).subscribe(v => {
      origin_start_date = v.start_date;
      origin_end_date = v.end_date;
    });
    this.DatePickerForm = fb.group({
      'start_date': [origin_start_date ? origin_start_date.toDate() : null],
      'end_date': [origin_end_date ? origin_end_date.toDate() : null]
    });
    this.DatePickerForm.valueChanges.subscribe(v => {
      this.store.dispatch(
        new RepairHistoryCollectStoreActions.ChangeSelectedDate(
          {
            start_date: moment(v.start_date),
            end_date: moment(v.end_date)
          }));
    });
  }

  public open_panel() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenPanel(true));
  }

  public change_form_by_button(type: string, value: number) {
    let start_date: moment.Moment;
    let end_date: moment.Moment;
    const today = moment().hours(0).minutes(0).seconds(0);
    if (type === 'month') {
      if (value === 0) { // 本周内
        start_date = moment(today).days(1);
        end_date = moment(today);
      } else if (value === 1) {
        start_date = moment(today).date(1);
        end_date = moment(today);
      } else if (value === 2) {
        start_date = moment(today).month(today.month() - 1).date(1);
        end_date = moment(today).date(1).add(-1, 'days');
      }
      this.DatePickerForm.setValue({start_date: start_date.toDate(), end_date: end_date.toDate()});

    } else if (type === 'length') {
      start_date = moment(today).add(-value, 'days');
      end_date = moment(today);
      this.DatePickerForm.setValue({start_date: start_date.toDate(), end_date: end_date.toDate()});
    }
  }


  ngOnInit() {
  }


  public $get_repair_plan_data_from_server() {
    // 从服务器读取天窗修统计数据
    let state;
    this.$state.take(1).subscribe(v => state = v);
    if (state.start_date.isSameOrBefore(state.end_date)) {
      const url = `/api/scrapy/history-list/repair/?start` +
        `=${state.start_date.format('YYYYMMDD')}&end=${state.end_date.format('YYYYMMDD')}`;
      this.http.get(url).do(() => this.store.dispatch(new RepairHistoryCollectStoreActions.switchPendingRepairPlan(true)))
        .subscribe(
          v => {
            const json: RepairPlanApi = v.json();
          },
          () => {
          },
          () => this.store.dispatch(new RepairHistoryCollectStoreActions.switchPendingRepairPlan(false))
        );
    } else {
      this.snack_bar.open('日期选择错误', 'X', {duration: 2000});
    }
  }

  public close_slide_bar() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenPanel(false));
  }

}
