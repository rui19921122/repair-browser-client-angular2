import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {RepairHistoryCollectStoreActions, RepairPlanSingleDataInterface} from './../repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-repair-plan-dialog',
  templateUrl: './repair-plan-dialog.component.html',
  styleUrls: ['./repair-plan-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepairPlanDialogComponent implements OnInit, OnDestroy {
  $plan_data: Observable<RepairPlanSingleDataInterface>;
  $dialog_plan_number: Observable<number>;
  form: FormGroup;

  constructor(public store: Store<AppState>,
              public fb: FormBuilder) {
    this.$dialog_plan_number = this.store.select(state => state.repair_history_collect.dialog_settings.dialog_number);
    this.$plan_data = this.store.select(
      state => state.repair_history_collect.repair_plan_data[state.repair_history_collect.dialog_settings.dialog_number]);
    this.form = this.fb.group(
      {'type': ['', [Validators.required]]},
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  close() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog({dialog_type: ''}));
  }

}
