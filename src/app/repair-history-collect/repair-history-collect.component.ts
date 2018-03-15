import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {
  RepairHistoryCollectStoreActions,
  RepairHistoryCollectStoreInterface,
  RepairHistoryDataStoreInterface,
  RepairPlanAndHistoryDataMappedInterface,
  RepairPlanDataStoreInterface
} from './repair-history-collect.store';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import * as moment from 'moment';
import {Observable} from 'rxjs/Rx';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {RepairHistoryApiInterface, RepairPlanApiInterface} from '../api';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {dialogConfig} from '../dialog-config';
import {mock_history_data, mock_repair_data} from './mock-data';
import {HttpClient} from '@angular/common/http';
import {WatchStoreChangeService} from '../../services/watch_store_change_sub';
import {RepairCollectGetBaseDataFromServerService} from '../../services/repair-collect-get-base-data-from-server.service';
import {SnackBarConfig} from '../../providers/snack-bar-provider';
import {EditDataDialogComponent} from './edit-data-dialog/edit-data-dialog.component';
import {UserStoreInterface} from '../../services/user.service';

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
export class RepairHistoryCollectComponent implements OnInit, AfterViewInit, OnDestroy {
  // 此层组件作为路由的一级控件，负责
  public page_height: number;
  public month_button_choices: [ButtonType, ButtonType];
  public length_button_choices: [ButtonType, ButtonType, ButtonType];
  public DatePickerForm: FormGroup;
  public $state: Observable<RepairHistoryCollectStoreInterface>;
  public search_for_plan_data = new Subject();
  public search_for_history_data = new Subject();
  public $repair_plan_and_history_data: Observable<RepairPlanAndHistoryDataMappedInterface[]>;
  public $show_all_dates_on_header: Observable<boolean>;
  public listen_for_keyboard_click_unsubscribe: Subscription;
  public $repair_plan_data: Observable<RepairPlanDataStoreInterface[]>;
  public $repair_history_data: Observable<RepairHistoryDataStoreInterface[]>;
  public edit_dialog: Observable<{ method: 'plan' | 'history' | '', number: string }>;
  public edit_dialog_sub: Subscription;

  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar,
              public dialog: MatDialog,
              public snack_bar_config: SnackBarConfig,
              public watch_store_change_service: WatchStoreChangeService,
              public repair_collect_get_data_from_server_service: RepairCollectGetBaseDataFromServerService,
              public fb: FormBuilder) {
    // 对话框相关
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
  }

  handle_show_all_clicked(boolean) {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchShowAllDatesOnDatesHeader(boolean));
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
    this.edit_dialog = this.store.select(state => state.repair_history_collect.content_settings.witch_number_is_in_edit);
    this.edit_dialog_sub = this.edit_dialog.subscribe(value => {
      if (value.method === '') {
        this.dialog.closeAll();
      } else {
        setTimeout(
          () => this.dialog.open(EditDataDialogComponent, {disableClose: true})
        );
      }
    });
    this.$repair_plan_data = this.store.select(state => state.repair_history_collect.repair_plan_data);
    this.$repair_history_data = this.store.select(state => state.repair_history_collect.repair_history_data);
    this.watch_store_change_service.watch_for_plan_and_history_data_map(true);
    this.$repair_plan_and_history_data = this.store.select(state =>
      state.repair_history_collect.repair_plan_and_history_data_mapped);
    this.$state = this.store.select(state2 => state2.repair_history_collect);
    this.$show_all_dates_on_header = this.store.select(state => state.repair_history_collect.show_all_dates_on_dates_header);
    this.search_for_plan_data.subscribe(() => {
      this.repair_collect_get_data_from_server_service.get_repair_plan_data_from_server();
    });
    this.search_for_history_data
      .subscribe(() => {
          this.repair_collect_get_data_from_server_service.get_repair_history_data_from_server();
        }
      );
    this.listen_for_keyboard_click_unsubscribe = Observable.fromEvent(document, 'keydown')
      .subscribe((v: KeyboardEvent) => {
        switch (v.key) {
          case 'q':
            this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenWhichSidebar('date_select'));
            break;
          case 'w':
            this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenWhichSidebar('date_list'));
            break;
          default:
            return;
        }
      });
    this.page_height = window.innerHeight - 52;
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
  }


  public $get_repair_plan_data_from_server() {
    // 从服务器读取天窗修统计数据
    let state;
    this.$state.take(1).subscribe(v => state = v);
    if (state.start_date.isSameOrBefore(state.end_date)) {
      const url = `/api/scrapy/history-list/repair/?start` +
        `=${state.start_date.format('YYYYMMDD')}&end=${state.end_date.format('YYYYMMDD')}`;
      this.http.get(url).do(() => this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(true)))
        .subscribe(
          (v: RepairPlanApiInterface) => {
            const json: RepairPlanApiInterface = v;
          },
          () => {
          },
          () => this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchPendingRepairPlan(false))
        );
    } else {
      this.snack_bar.open('日期选择错误', ...this.snack_bar_config as any);
    }
  }

  public close_slide_bar() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenWhichSidebar(''));
  }

}
