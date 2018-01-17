import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {
  RepairHistoryCollectStoreActions, RepairHistoryDataStoreInterface, RepairHistoryDetailDataStoreInterface,
  RepairPlanDataStoreInterface
} from '../repair-history-collect.store';
import * as moment from 'moment';
import {convert_h_mm_time_format_to_hh_mm_time_format, get_obj_from_array_by_id} from '../../util_func';
import {RepairHistoryApiInterface} from '../../api';
import {Subscription} from 'rxjs/Subscription';

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
  public inner_id_history_group: FormControl;
  public use_paper_history_group: FormControl;
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
    this.store.select(state => state.repair_history_collect).take(1).subscribe(value => {
      let plan: RepairPlanDataStoreInterface, history: RepairHistoryDataStoreInterface, detail: RepairHistoryDetailDataStoreInterface;
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
      if (plan) {
        this.date_group.setValue(plan.date.toDate());
        this.type_plan_group.setValue(plan.type);
        this.time_plan_group.setValue(plan.plan_time);
        this.area_plan_group.setValue(plan.area);
        this.number_plan_group.setValue(plan.number);
        this.calc_time_plan_group.setValue(plan.calc_time);
        this.start_time_plan_group.setValue(
          convert_h_mm_time_format_to_hh_mm_time_format(plan.start_time)
        );
        this.end_time_plan_group.setValue(
          convert_h_mm_time_format_to_hh_mm_time_format(plan.end_time)
        );
        this.used_number_plan_group.setValue(plan.used_number);
        this.longing_plan_group.setValue(plan.longing);
      }
      if (history) {
        this.inner_id_history_group.setValue(history.inner_id);
        this.use_paper_history_group.setValue(history.use_paper);
      }
      if (detail) {
        this.actual_start_time_detail_group.setValue(
          convert_h_mm_time_format_to_hh_mm_time_format(detail.actual_start_time.format('HH:mm'))
        );
        this.actual_end_time_detail_group.setValue(
          convert_h_mm_time_format_to_hh_mm_time_format(detail.actual_end_time.format('HH:mm'))
        );
        this.actual_start_number_detail_group.setValue(detail.actual_start_number);
        this.actual_end_number_detail_group.setValue(detail.actual_end_number);
        this.actual_watcher_detail_group.setValue(detail.actual_watcher);
        this.actual_longing_detail_group.setValue(detail.longing);
      }
      this.sub1 = this.number_plan_group.valueChanges
        .merge(this.type_plan_group.valueChanges)
        .merge(this.date_group.valueChanges)
        .debounceTime(10).subscribe(() => {
          if (this.number_plan_group.value && this.type_plan_group.value && this.date_group.value) {
            this.used_number_plan_group.setValue(`${moment(this.date_group.value).format('YYYYMMDD')}-${this.type_plan_group.value === '站'
              ? 'Z' : (this.type_plan_group.value === '垂' ? 'D' : 'J')}${this.number_plan_group.value}`);
          }
        });
      this.sub2 = this.calc_time_plan_group.valueChanges.debounceTime(10).subscribe(v => {
        if (v) {
          this.start_time_plan_group.disable();
          this.start_time_plan_group.setValue('');
          this.end_time_plan_group.disable();
          this.end_time_plan_group.setValue('');
          this.longing_plan_group.enable();
          this.longing_plan_group.setValue(0);
        } else {
          this.start_time_plan_group.enable();
          this.end_time_plan_group.enable();
          this.longing_plan_group.disable();
        }
      });
      this.sub3 = this.start_time_plan_group.valueChanges.merge(this.end_time_plan_group.valueChanges)
        .subscribe(() => {
          const start = this.start_time_plan_group.value;
          const end = this.end_time_plan_group.value;
          if (start && end) {
            const start_moment = moment(start, 'HH:mm');
            const end_moment = moment(end, 'HH:mm');
            if (end_moment.isAfter(start_moment)) {
              this.longing_plan_group.setValue(
                end_moment.diff(start_moment, 'minutes')
              );
            } else {
              this.longing_plan_group.setValue(0);
            }
          }
        });
      this.sub4 = this.actual_start_time_detail_group.valueChanges.merge(this.actual_end_time_detail_group.valueChanges)
        .subscribe(() => {
          const start = this.actual_start_time_detail_group.value;
          const end = this.actual_end_time_detail_group.value;
          if (start && end) {
            const start_moment = moment(start, 'HH:mm');
            const end_moment = moment(end, 'HH:mm');
            if (end_moment.isAfter(start_moment)) {
              this.actual_longing_detail_group.setValue(
                end_moment.diff(start_moment, 'minutes')
              );
            } else {
              this.actual_longing_detail_group.setValue(0);
            }
          }
        });
      if (history && (!plan)) {
        this.date_group.setValue(history.date.toDate());
        const number = history.number.split('-')[1];
        const type = number[0];
        const converted_value = number.slice(1, number.length);
        this.type_plan_group.setValue(type === 'J' ? '局' : (type === 'Z' ? '站' : '垂'));
        this.number_plan_group.setValue(converted_value);
        this.longing_plan_group.setValue(0);
      }
    });
  }

  ngOnDestroy() {
    console.log('destroyed');
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

  public close_without_save() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.EditDataById({dialog_type: '', dialog_id: null}));
  }

}
