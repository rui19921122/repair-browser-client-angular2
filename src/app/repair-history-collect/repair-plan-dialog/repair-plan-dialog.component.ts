import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {RepairHistoryCollectStoreActions, RepairPlanSingleDataInterface} from './../repair-history-collect.store';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-repair-plan-dialog',
  templateUrl: './repair-plan-dialog.component.html',
  styleUrls: ['./repair-plan-dialog.component.css']
})
export class RepairPlanDialogComponent implements OnInit, OnDestroy {
  $plan_data: Observable<RepairPlanSingleDataInterface>;
  $dialog_plan_number: Observable<number>;

  constructor(public store: Store<AppState>) {
    this.$dialog_plan_number = this.store.select(state => state.repair_history_collect.dialog_settings.dialog_number);
    this.$plan_data = this.store.select(
      state => state.repair_history_collect.repair_plan_data[state.repair_history_collect.dialog_settings.dialog_number]);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  close() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog({dialog_type: ''}));
  }

}
