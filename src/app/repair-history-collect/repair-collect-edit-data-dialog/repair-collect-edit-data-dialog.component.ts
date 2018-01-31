import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {
  RepairHistoryCollectStoreActions, RepairHistoryDataStoreInterface, RepairDetailDataStoreInterface,
  RepairPlanDataStoreInterface
} from '../repair-history-collect.store';
import * as moment from 'moment';
import {convert_h_mm_time_format_to_hh_mm_time_format, get_obj_from_array_by_id} from '../../util_func';
import {RepairHistoryApiInterface} from '../../api';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {ActionSequence} from 'selenium-webdriver';

@Component({
  selector: 'app-repair-collect-edit-data-dialog',
  templateUrl: './repair-collect-edit-data-dialog.component.html',
  styleUrls: ['./repair-collect-edit-data-dialog.component.css']
})
export class RepairCollectEditDataDialogComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public date_group: FormControl;
  public type_plan_group: FormControl;
  public time_plan_group: FormControl;
  public area_plan_group: FormControl;
  public number_plan_group: FormControl;
  public calc_time_plan_group: FormControl;
  public start_time_plan_group: FormControl;
  public end_time_plan_group: FormControl;
  public used_number_plan_group: FormControl;
  public longing_plan_group: FormControl; // 持续时间，以分钟为单位
  public actual_start_time_detail_group: FormControl;
  public actual_end_time_detail_group: FormControl;
  public actual_start_number_detail_group: FormControl;
  public actual_end_number_detail_group: FormControl;
  public actual_watcher_detail_group: FormControl; // 把关人
  public actual_longing_detail_group: FormControl;
  public note_detail_group: FormControl;
  public inner_id_history_group: FormControl;
  public use_paper_history_group: FormControl;
  public is_canceled_none_group: FormControl;
  public sub1: Subscription;
  public sub2: Subscription;
  public sub3: Subscription;
  public sub4: Subscription;
  public sub5: Subscription;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.date_group = new FormControl();
    this.form.addControl('date', this.date_group);
    this.type_plan_group = new FormControl();
    this.form.addControl('type_plan', this.type_plan_group);
    this.time_plan_group = new FormControl();
    this.form.addControl('time_plan', this.time_plan_group);
    this.area_plan_group = new FormControl();
    this.form.addControl('area_plan', this.area_plan_group);
    this.number_plan_group = new FormControl();
    this.form.addControl('number_plan', this.number_plan_group);
    this.calc_time_plan_group = new FormControl();
    this.form.addControl('calc_time_plan', this.calc_time_plan_group);
    this.start_time_plan_group = new FormControl();
    this.form.addControl('start_time_plan', this.start_time_plan_group);
    this.end_time_plan_group = new FormControl();
    this.form.addControl('end_time_plan', this.end_time_plan_group);
    this.used_number_plan_group = new FormControl();
    this.used_number_plan_group.disable();
    this.longing_plan_group = new FormControl(); // 持续时间，以分钟为单位
    this.longing_plan_group.disable();
    this.form.addControl('longing_plan', this.longing_plan_group);
    this.actual_start_time_detail_group = new FormControl();
    this.form.addControl('actual_start_time_detail', this.actual_start_time_detail_group);
    this.actual_end_time_detail_group = new FormControl();
    this.form.addControl('actual_end_time_detail', this.actual_end_time_detail_group);
    this.actual_start_number_detail_group = new FormControl();
    this.form.addControl('actual_start_number_detail', this.actual_start_number_detail_group);
    this.actual_end_number_detail_group = new FormControl();
    this.form.addControl('actual_end_number_detail', this.actual_end_number_detail_group);
    this.actual_watcher_detail_group = new FormControl(); // 把关人
    this.form.addControl('actual_watcher_detail', this.actual_watcher_detail_group);
    this.inner_id_history_group = new FormControl();
    this.form.addControl('inner_id_history', this.inner_id_history_group);
    this.use_paper_history_group = new FormControl();
    this.form.addControl('use_paper_history', this.use_paper_history_group);
    this.actual_longing_detail_group = new FormControl();
    this.form.addControl('actual_longing', this.actual_longing_detail_group);
    this.actual_longing_detail_group.disable();
    this.is_canceled_none_group = new FormControl();
    this.form.addControl('is_canceled', this.is_canceled_none_group);
    this.note_detail_group = new FormControl();
    this.form.addControl('note', this.note_detail_group);
    this.reset();
    this.change_the_whole_form_value_by_logic();
    this.sub1 = this.form.valueChanges.throttleTime(10).subscribe(() => {
      this.change_the_whole_form_value_by_logic();
    });
    this.sub2 = this.calc_time_plan_group.valueChanges.distinctUntilChanged().subscribe(value => {
      if (!value) {
        this.longing_plan_group.setValue(0);
      }
    });
  }

  get_current_state(): {
    plan: RepairPlanDataStoreInterface, detail: RepairDetailDataStoreInterface, history: RepairHistoryDataStoreInterface
  } {
    let plan: RepairPlanDataStoreInterface, history: RepairHistoryDataStoreInterface, detail: RepairDetailDataStoreInterface;
    this.store.select(state => state.repair_history_collect).take(1).subscribe(value => {
      if (value.content_settings.witch_number_is_in_edit.method === 'plan') {
        plan = get_obj_from_array_by_id(
          value.repair_plan_data, value.content_settings.witch_number_is_in_edit.number
        ).obj;
        loop1:
          for (const m of value.repair_plan_and_history_data_mapped) {
            for (const i of m.repair_plan_data_index_on_this_day) {
              if (i.plan_number_id === plan.id) {
                history = get_obj_from_array_by_id(value.repair_history_data, i.history_number_id).obj;
                detail = get_obj_from_array_by_id(value.repair_detail_data, i.history_number_id).obj;
                break loop1;
              }
            }
          }
      } else {
        history = get_obj_from_array_by_id(
          value.repair_history_data, value.content_settings.witch_number_is_in_edit.number
        ).obj;
        detail = get_obj_from_array_by_id(value.repair_detail_data, history.id).obj;
        loop1:
          for (const m of value.repair_plan_and_history_data_mapped) {
            for (const i of m.repair_plan_data_index_on_this_day) {
              if (i.history_number_id === history.id) {
                plan = get_obj_from_array_by_id(value.repair_plan_data, i.history_number_id).obj;
                break loop1;
              }
            }
          }
      }
    });
    return {plan, detail, history};
  }

  reset() {
    const {plan, history, detail} = this.get_current_state();
    if (plan) {
      this.date_group.setValue(plan.date.toDate());
      this.type_plan_group.setValue(plan.type);
      this.time_plan_group.setValue(plan.plan_time);
      this.area_plan_group.setValue(plan.area);
      this.number_plan_group.setValue(plan.number);
      this.calc_time_plan_group.setValue(plan.calc_time);
      if (plan.calc_time) {
        this.start_time_plan_group.setValue(
          convert_h_mm_time_format_to_hh_mm_time_format(plan.start_time)
        );
        this.end_time_plan_group.setValue(
          convert_h_mm_time_format_to_hh_mm_time_format(plan.end_time)
        );
      } else {
        this.start_time_plan_group.setValue('');
        this.end_time_plan_group.setValue('');
      }
      this.longing_plan_group.setValue(plan.longing);
      this.used_number_plan_group.setValue(plan.used_number);
    }
    if (history) {
      this.inner_id_history_group.setValue(history.inner_id);
      this.use_paper_history_group.setValue(history.use_paper);
    }
    if (detail) {
      this.actual_start_time_detail_group.setValue(
        detail.actual_start_time ?
          convert_h_mm_time_format_to_hh_mm_time_format(detail.actual_start_time.format('HH:mm'))
          : ''
      );
      this.actual_end_time_detail_group.setValue(
        detail.actual_end_time ?
          convert_h_mm_time_format_to_hh_mm_time_format(detail.actual_end_time.format('HH:mm'))
          : ''
      );
      this.actual_start_number_detail_group.setValue(detail.actual_start_number);
      this.actual_end_number_detail_group.setValue(detail.actual_end_number);
      this.actual_watcher_detail_group.setValue(detail.actual_watcher);
      this.actual_longing_detail_group.setValue(detail.longing);
      this.is_canceled_none_group.setValue(detail.canceled);
    } else {
      this.actual_longing_detail_group.setValue(0);
      this.actual_start_time_detail_group.setValue('');
      this.actual_end_time_detail_group.setValue('');
      this.actual_start_number_detail_group.setValue('');
      this.actual_end_number_detail_group.setValue('');
      this.actual_watcher_detail_group.setValue('');
      this.is_canceled_none_group.setValue(false);
    }
    if (history && (!plan)) {
      this.date_group.setValue(history.date.toDate());
      const number = history.number.split('-')[1];
      const type = number[0];
      const converted_value = number.slice(1, number.length);
      this.type_plan_group.setValue(type === 'J' ? '局' : (type === 'Z' ? '站' : '垂'));
      this.number_plan_group.setValue(converted_value);
      this.longing_plan_group.setValue(0);
    }
    return false;
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
    if (this.sub4) {
      this.sub4.unsubscribe();
    }
    if (this.sub5) {
      this.sub5.unsubscribe();
    }
  }

  public submit() {
    const {plan, history, detail} = this.get_current_state();
    this.store.dispatch(new RepairHistoryCollectStoreActions.EditWholeDetail(
      {
        history, plan, detail,
        form: {
          is_canceled: this.is_canceled_none_group.value,
          detail_start_number: this.actual_start_number_detail_group.value,
          detail_end_number: this.actual_end_number_detail_group.value,
          detail_watcher: this.actual_watcher_detail_group.value,
          detail_start_time: this.actual_start_time_detail_group.value,
          detail_end_time: this.actual_end_time_detail_group.value,
          detail_longing: this.actual_longing_detail_group.value,
          plan_end_time: this.end_time_plan_group.value,
          plan_start_time: this.start_time_plan_group.value,
          plan_calc_time: this.calc_time_plan_group.value,
          plan_longing: this.longing_plan_group.value,
          area: this.area_plan_group.value,
          date: this.date_group.value,
          note: this.note_detail_group.value,
          number: this.number_plan_group.value,
          type: this.type_plan_group.value,
          use_paper: this.use_paper_history_group.value,
          used_number: this.used_number_plan_group.value
        }
      }
    ));
  }

  public change_the_whole_form_value_by_logic() {
    // 根据逻辑关系重置整张表的状态
    if (this.is_canceled_none_group.value) {
      this.actual_end_number_detail_group.setValue('');
      this.actual_start_number_detail_group.setValue('');
      this.actual_end_time_detail_group.setValue('');
      this.actual_start_number_detail_group.disable();
      this.actual_end_number_detail_group.disable();
      this.actual_longing_detail_group.disable();
      this.actual_start_time_detail_group.setValue('');
      this.actual_start_time_detail_group.disable();
      this.actual_end_time_detail_group.disable();
      this.actual_watcher_detail_group.disable();
      this.actual_watcher_detail_group.setValue('');
    } else {
      this.actual_start_number_detail_group.enable();
      this.actual_end_number_detail_group.enable();
      this.actual_start_time_detail_group.enable();
      this.actual_end_time_detail_group.enable();
      this.actual_watcher_detail_group.enable();
    }
    if (!this.calc_time_plan_group.value) {
      this.start_time_plan_group.disable();
      this.start_time_plan_group.setValue('');
      this.end_time_plan_group.disable();
      this.end_time_plan_group.setValue('');
      this.longing_plan_group.enable();
    } else {
      this.start_time_plan_group.enable();
      this.end_time_plan_group.enable();
      this.longing_plan_group.disable();
    }
    if (this.number_plan_group.value && this.type_plan_group.value && this.date_group.value) {
      this.used_number_plan_group.setValue(`${moment(this.date_group.value).format('YYYYMMDD')}-${this.type_plan_group.value === '站'
        ? 'Z' : (this.type_plan_group.value === '垂' ? 'D' : 'J')}${this.number_plan_group.value}`);
    }
    const start_plan = this.start_time_plan_group.value;
    const end_plan = this.end_time_plan_group.value;
    if (start_plan && end_plan) {
      const start_moment = moment(start_plan, 'HH:mm');
      const end_moment = moment(end_plan, 'HH:mm');
      if (end_moment.isAfter(start_moment)) {
        this.longing_plan_group.setValue(
          end_moment.diff(start_moment, 'minutes')
        );
      } else {
        this.longing_plan_group.setValue(0);
      }
    }
    const start_actual = this.actual_start_time_detail_group.value;
    const end_actual = this.actual_end_time_detail_group.value;
    if (start_actual && end_actual) {
      const start_moment = moment(start_actual, 'HH:mm');
      const end_moment = moment(end_actual, 'HH:mm');
      if (end_moment.isAfter(start_moment)) {
        this.actual_longing_detail_group.setValue(
          end_moment.diff(start_moment, 'minutes')
        );
      } else {
        this.actual_longing_detail_group.setValue(0);
      }
    }
  }

  public close_without_save() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.EditDataById({dialog_type: '', dialog_id: null}));
  }

  public check_form_is_valid(): boolean {
    if (!this.calc_time_plan_group.value) {
      if (this.longing_plan_group.value === 0) {
        // 如果没有确切时间，则必须手动输入持续时长，且时长不应为0
        return false;
      }
    } else {
      if (this.start_time_plan_group.value === '' || this.end_time_plan_group.value === '') {
        return false;
      }
    }
    if (!this.is_canceled_none_group.value) {
      if (this.actual_start_time_detail_group.value === '' || this.actual_end_time_detail_group.value === '') {
        return false;
      }
    }
    return true;
  }

}
