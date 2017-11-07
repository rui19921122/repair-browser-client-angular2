import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {RepairHistoryCollectStoreActions, RepairPlanSingleDataInterface} from './../repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {generate_a_id} from '../../util_func';

function end_time_should_later_than_start_time(start: string, end: string): boolean {
  if (start && end) {
    const start_moment = moment().hours(Number(start.split(':')[0])).minutes(Number(start.split(':')[1]));
    const end_moment = moment().hours(Number(end.split(':')[0])).minutes(Number(end.split(':')[1]));
    return start_moment.isBefore(end_moment);
  } else {
    return false;
  }
}

function convert_h_mm_time_format_to_hh_mm_time_format(string: string) {
  return string.length === 5 ? string : '0' + string;
}

@Component({
  selector: 'app-repair-plan-dialog',
  templateUrl: './repair-plan-dialog.component.html',
  styleUrls: ['./repair-plan-dialog.component.css'],
})
export class RepairPlanDialogComponent implements OnInit, OnDestroy {
  $plan_data: Observable<{ [id: string]: RepairPlanSingleDataInterface }>;
  $dialog_plan_number: Observable<string>;
  origin_data: RepairPlanSingleDataInterface = null;
  form: FormGroup;
  checkbox_un: Subscription;
  time_un: Subscription;
  number_un: Subscription;
  warns: { [field: string]: string[] } = {number: []};

  constructor(public store: Store<AppState>,
              public fb: FormBuilder,
              public cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.$dialog_plan_number = this.store.select(state => state.repair_history_collect.dialog_settings.dialog_id);
    this.$plan_data = this.store.select(
      state => state.repair_history_collect.repair_plan_data
    );
    this.form = this.fb.group(
      {
        type: [''],
        start_time: [''],
        date: [{value: '', disabled: true}],
        end_time: [''],
        calc_time: [true],
        apply_place: [''],
        area: [''],
        direction: [''],
        number: [null, Validators.required],
      }
    );
    const un = this.$plan_data.withLatestFrom(this.$dialog_plan_number).subscribe(values => {
      const value: RepairPlanSingleDataInterface = values[0][values[1]];
      if (value) {
        this.origin_data = value;
        this.form.setValue(
          {
            type: value.type ? value.type : '',
            start_time: !value.calc_time ? convert_h_mm_time_format_to_hh_mm_time_format(value.plan_time.split('-')[0]) : '',
            end_time: !value.calc_time ? convert_h_mm_time_format_to_hh_mm_time_format(value.plan_time.split('-')[1]) : '',
            direction: value.direction ? value.direction : '',
            area: value.area ? value.area : '',
            calc_time: !value.calc_time, // 注意这个，与实际不同
            apply_place: value.apply_place ? value.apply_place : '',
            number: value.number ? value.number : null,
            date: value.date ? value.date.toDate() : null,
          }
        );
      }
    });
    un.unsubscribe();
    this.checkbox_un = this.form.controls['calc_time'].valueChanges.subscribe(value => {
      if (value) {
        this.form.controls['start_time'].enable();
        this.form.controls['end_time'].enable();
      } else {
        // 如果不统计时间，则将开始时间和结束时间格选为空
        this.form.controls['start_time'].setValue(null);
        this.form.controls['start_time'].disable();
        this.form.controls['end_time'].setValue(null);
        this.form.controls['end_time'].disable();
      }
    });
    this.time_un = this.form.controls['start_time'].valueChanges.merge(this.form.controls['end_time'].valueChanges).subscribe(v => {
        if (
          this.form.controls['calc_time'].value
        ) {
          if (!end_time_should_later_than_start_time(this.form.controls['start_time'].value, this.form.controls['end_time'].value)) {
            this.form.controls['end_time'].setErrors({time: true});
          } else {
            this.form.controls['end_time'].setErrors(null);
          }
        } else {
          this.form.controls['end_time'].setErrors(null);
        }
      }
    );
    this.number_un = this.form.valueChanges.withLatestFrom(this.$plan_data).subscribe(
      (value: [{ date: Date, number: string }, { [id: string]: RepairPlanSingleDataInterface }]) => {
        const _: string[] = [];
        if (this.origin_data) {
          if (value[0].toString() !== this.origin_data.number) {
            _.push('您正在修改天窗修编号，请谨慎修改');
            const new_id = generate_a_id(value[0]);
            if (value[1][new_id]) {
              _.push('天窗修编号与当日其他的天窗修编号重合，您的修改将会覆盖重合的天窗修详情，请确认');
            }
          }
        } else {
        }
        this.warns['number'] = _;
      });
  }

  ngOnDestroy() {
    if (this.checkbox_un) {
      this.checkbox_un.unsubscribe();
    }
    if (this.time_un) {
      this.time_un.unsubscribe();
    }
    if (this.number_un) {
      this.number_un.unsubscribe();
    }
  }

  close() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog({dialog_type: ''}));
  }

  handle_submit() {
    if (this.form.valid) {
      this.store.dispatch(new RepairHistoryCollectStoreActions.UpdateRepairPlanData({
          number: this.form.controls['number'].value,
          date: moment(this.form.controls['date'].value),
          calc_time: !this.form.controls['calc_time'],
          plan_time:
            this.form.controls['calc_time'] ?
              `${this.form.controls['start_time'].value}-${this.form.controls['end_time'].value}` : '',
          apply_place: this.form.controls['apply_place'].value,
          direction: this.form.controls['direction'].value,
          type: this.form.controls['type'].value,
          area: this.form.controls['area'].value,
          content: [],
          id: null,
        }),
      );
      this.store.dispatch(new RepairHistoryCollectStoreActions.MapPlanAndHistoryNumber());
      this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog({dialog_type: ''}));
    } else {
      console.log(this.form.errors);
    }
  }

}
