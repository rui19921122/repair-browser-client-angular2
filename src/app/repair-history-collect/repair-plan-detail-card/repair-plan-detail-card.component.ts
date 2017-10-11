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

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
  }

  open_change_dialog(id: number) {
    this.store.dispatch(new RepairHistoryCollectStoreActions.OpenOrCloseADialog(
      {dialog_type: 'repair_plan', dialog_id: id}
    ));
  }
}
