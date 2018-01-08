import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RepairPlanSingleDataInterface, RepairHistoryCollectStoreActions} from '../repair-history-collect.store';
import {MatDialog} from '@angular/material';
import {RepairPlanEditDialogComponent} from '../repair-plan-edit-dialog/repair-plan-dialog.component';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {convert_h_mm_time_format_to_hh_mm_time_format} from '../../util_func';
import * as moment from 'moment';

@Component({
  selector: 'app-repair-plan-detail-card',
  templateUrl: './repair-plan-detail-card.component.html',
  styleUrls: ['./repair-plan-detail-card.component.css']
})
export class RepairPlanDetailCardComponent implements OnInit, OnDestroy {
  @Input() plan_data = <RepairPlanSingleDataInterface>null;
  @Input() history_data_id: string;
  public data: RepairPlanSingleDataInterface;
  public is_edit = false;
  public un: Subscription;
  public form: FormGroup;

  constructor(public store: Store<AppState>,
              public fb: FormBuilder,) {
  }

  ngOnInit() {
    const dialog_settings = this.store.select(state => state.repair_history_collect.dialog_settings);
    this.un = dialog_settings.subscribe(value => {
      if (this.plan_data) {
        this.is_edit = this.plan_data.id === value.dialog_id && value.which_dialog_open === 'repair_plan';
        this.form = this.fb.group(
          {
            type: [''],
            start_time: [''],
            end_time: [''],
            calc_time: [true],
            area: [''],
            number: [null, Validators.required],
          }
        );
        this.form.setValue(
          {
            type: this.plan_data.type ? this.plan_data.type : '',
            start_time: this.plan_data.calc_time ? convert_h_mm_time_format_to_hh_mm_time_format(
              this.plan_data.plan_time.split('-')[0]) : '',
            end_time: this.plan_data.calc_time ? convert_h_mm_time_format_to_hh_mm_time_format(
              this.plan_data.plan_time.split('-')[1]) : '',
            area: this.plan_data.area ? this.plan_data.area : '',
            calc_time: this.plan_data.calc_time,
            number: this.plan_data.number ? this.plan_data.number : null,
          }
        );
      } else {
        this.is_edit = false;
        this.form = null;
      }
    });
  }

  ngOnDestroy() {
    if (this.un) {
      this.un.unsubscribe();
    }
  }

  get_used_number(): string {
    return `${moment(this.plan_data.date)
      .format('YYYYMMDD')}-${this.form.controls['type'].value === '站' ? 'Z' : (this.form.controls['type'].value === '垂' ?
      'D' : 'J')}${this.form.controls['number'].value}`;
  }

  handle_submit() {
    const edited_value: RepairPlanSingleDataInterface = this.form.getRawValue();
    const origin_value: RepairPlanSingleDataInterface = this.plan_data;
  }

  open_change_dialog(id: string) {
    this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog(
      {dialog_type: 'repair_plan', dialog_id: id}
    ));
  }

  create_repair_plan_from_history() {
    console.log(this.history_data_id);
  }
}
