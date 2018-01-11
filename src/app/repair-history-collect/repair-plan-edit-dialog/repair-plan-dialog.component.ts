import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {RepairHistoryCollectStoreActions, RepairPlanSingleDataInterface} from './../repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {
  convert_h_mm_time_format_to_hh_mm_time_format, end_time_should_later_than_start_time, generate_a_id,
  get_obj_from_array_by_id
} from '../../util_func';

@Component({
  selector: 'app-repair-plan-dialog',
  templateUrl: './repair-plan-dialog.component.html',
  styleUrls: ['./repair-plan-dialog.component.css'],
})
export class RepairPlanEditDialogComponent implements OnInit, OnDestroy {
  $plan_data: Observable<RepairPlanSingleDataInterface[]>;
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
    this.$dialog_plan_number = this.store.select(state => {
      return get_obj_from_array_by_id(state.repair_history_collect.repair_plan_data,
        state.repair_history_collect.dialog_settings.dialog_id).obj.id;
    });
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
        number: [null, Validators.required],
        longing: [null, Validators.required]
      }
    );
    const un = this.$plan_data.withLatestFrom(this.$dialog_plan_number).subscribe(values => {
      const value: RepairPlanSingleDataInterface = get_obj_from_array_by_id(values[0], values[1]).obj;
      if (value) {
        this.origin_data = value;
        this.form.setValue(
          {
            type: value.type ? value.type : '',
            start_time: value.calc_time ? convert_h_mm_time_format_to_hh_mm_time_format(value.plan_time.split('-')[0]) : '',
            end_time: value.calc_time ? convert_h_mm_time_format_to_hh_mm_time_format(value.plan_time.split('-')[1]) : '',
            area: value.area ? value.area : '',
            calc_time: value.calc_time, // 注意这个，与实际不同
            apply_place: value.apply_place ? value.apply_place : '',
            number: value.number ? value.number : null,
            date: value.date ? value.date.toDate() : null,
            longing: value.longing ? value.longing : null
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
      (value: [{ date: Date, number: string },
        RepairPlanSingleDataInterface[]]) => {
        const _: string[] = [];
        if (this.origin_data) {
          if (value[0].toString() !== this.origin_data.number) {
            _.push(`您正在修改天窗修编号${this.origin_data.number}，请谨慎修改`);
            const new_id = generate_a_id(value[0]);
            if (value[1][new_id]) {
              _.push(`天窗修编号${this.origin_data.number}与当日其他的天窗修编号重合，您的修改将会覆盖重合的天窗修详情，请确认`);
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
      const number = this.form.controls['number'].value;
      const date = moment(this.form.controls['date'].value);
      const calc_time = !!this.form.controls['calc_time'];
      const plan_time = !!this.form.controls['calc_time'] ?
        `${this.form.controls['start_time'].value}-${this.form.controls['end_time'].value}` : '';
      const start_time = !!this.form.controls['calc_time'] ? this.form.controls['start_time'].value : null;
      const end_time = !!this.form.controls['calc_time'] ? this.form.controls['end_time'].value : null;
      const type = this.form.controls['type'].value;
      const area = this.form.controls['area'].value;
      const used_number = `${moment(this.form.controls['date'].value)
        .format('YYYYMMDD')}-${this.form.controls['type'].value === '站' ? 'Z' : (this.form.controls['type'].value === '垂' ?
        'D' : 'J')}${this.form.controls['number'].value}`;
      const longing = calc_time ? moment(end_time, 'HH:mm').diff(moment(start_time, 'HH:mm'), 'minutes')
        : this.form.controls['longing'].value.toInteger();
      const apply_place = this.form.controls['apply_place'].value;
      this.store.dispatch(new RepairHistoryCollectStoreActions.UpdateRepairPlanData(
        {
          number, date, calc_time, plan_time, start_time, end_time, type, area, used_number, longing,
          id: null,
          apply_place
        }
        ),
      );
      this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog({dialog_type: ''}));
    } else {
      console.log(this.form.errors);
    }
  }

}
