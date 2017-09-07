import {Component, OnInit, ViewChild, ViewChildren, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {UserService} from '../user.service';
import {RepairHistoryCollectStoreActions, RepairHistoryCollectStoreInterface} from './repair-history-collect.store';
import {MdSidenav, MdSnackBar} from '@angular/material';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {Http} from '@angular/http';
import {RepairPlanApi} from '../api';

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
  public state: RepairHistoryCollectStoreInterface;
  public page_height: number;
  public month_button_choices: [ButtonType, ButtonType];
  public length_button_choices: [ButtonType, ButtonType, ButtonType];
  public DatePickerForm: FormGroup;
  public is_login: Observable<boolean>;
  public $state: Observable<RepairHistoryCollectStoreInterface>;


  constructor(public http: Http,
              public store: Store<AppState>,
              public ng_change: ChangeDetectorRef,
              public snack_bar: MdSnackBar,
              fb: FormBuilder) {
    this.$state = this.store.select(state2 => state2.repair_history_collect);
    this.$state.subscribe(v => {
      this.state = v;
    });
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
    this.DatePickerForm = fb.group({
      'start_date': [this.state.start_date ? this.state.start_date.toDate() : null],
      'end_date': [this.state.end_date ? this.state.end_date.toDate() : null]
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

  public search_for_plan_data() {
    if (this.state.start_date.isSameOrBefore(this.state.end_date)) {
      const url = `/api/scrapy/plan/plan/?start_date` +
        `=${this.state.start_date.format('YYYY-MM-DD')}&end_date=${this.state.end_date.format('YYYY-MM-DD')}`;
      this.http.get(url).subscribe(v => console.log(v.json()));
    } else {
      this.snack_bar.open('日期选择错误', 'X', {duration: 2000});
    }
  }

  public $get_repair_plan_data_from_server() {
    // 从服务器读取天窗修统计数据
    if (this.state.start_date.isSameOrBefore(this.state.end_date)) {
      const url = `/api/scrapy/history-list/repair/?start` +
        `=${this.state.start_date.format('YYYYMMDD')}&end=${this.state.end_date.format('YYYYMMDD')}`;
      this.http.get(url).do(() => this.store.dispatch(new RepairHistoryCollectStoreActions.switchPendingRepairPlan(true)))
        .subscribe(
          v => {
            const json: RepairPlanApi = v.json();
            this.store.dispatch(new RepairHistoryCollectStoreActions.updateRepairData({data: json.data}));
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
