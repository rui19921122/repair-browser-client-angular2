import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {RepairHistoryCollectStoreActions, RepairPlanSingleDataInterface} from './../repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';

function end_time_should_later_than_start_time(start, end): { [s: string]: boolean } {
  return {asd: true};
}

@Component({
  selector: 'app-repair-plan-dialog',
  templateUrl: './repair-plan-dialog.component.html',
  styleUrls: ['./repair-plan-dialog.component.css'],
})
export class RepairPlanDialogComponent implements OnInit, OnDestroy {
  $plan_data: Observable<RepairPlanSingleDataInterface[]>;
  $dialog_plan_number: Observable<number>;
  form: FormGroup;

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
        end_time: [''],
        is_time: [''],
        apply_place: [''],
        area: [''],
        direction: [''],
      }
    );
    const un = this.$plan_data.withLatestFrom(this.$dialog_plan_number).subscribe(values => {
      const value: RepairPlanSingleDataInterface = values[0].find(v => v.id === values[1]);
      if (value) {
        this.form.setValue(
          {
            type: value.type ? value.type : '',
            start_time: value.is_time ? value.plan_time.split('-')[0] : '',
            end_time: value.is_time ? value.plan_time.split('-')[1] : '',
            direction: value.direction ? value.direction : '',
            area: value.area ? value.area : '',
            is_time: value.is_time,
            apply_place: value.apply_place ? value.apply_place : ''
          }
        );
      }
    });
    un.unsubscribe();
  }

  ngOnDestroy() {
  }

  close() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog({dialog_type: ''}));
  }

}
