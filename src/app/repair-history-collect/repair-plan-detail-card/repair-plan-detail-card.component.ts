import {Component, Input, OnInit} from '@angular/core';
import {RepairPlanSingleDataInterface, RepairHistoryCollectStoreActions} from '../repair-history-collect.store';
import {MatDialog} from '@angular/material';
import {RepairPlanDialogComponent} from '../repair-plan-dialog/repair-plan-dialog.component';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-repair-plan-detail-card',
  templateUrl: './repair-plan-detail-card.component.html',
  styleUrls: ['./repair-plan-detail-card.component.css']
})
export class RepairPlanDetailCardComponent implements OnInit {
  @Input() plan_data = <RepairPlanSingleDataInterface>null;
  @Input() history_data_id: string;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
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
