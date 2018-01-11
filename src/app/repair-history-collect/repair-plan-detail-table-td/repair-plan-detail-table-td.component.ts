import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RepairHistoryDetailAPIInterface} from '../../services/repair-history-detail-api.service';
import {
  RepairHistoryDataDetailInterface, RepairHistorySingleDataInterface,
  RepairPlanSingleDataInterface
} from '../repair-history-collect.store';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Subscription} from 'rxjs/Subscription';
import {get_obj_from_array_by_id} from '../../util_func';

@Component({
  /* tslint:disable */
  selector: '[app-repair-plan-detail-table-tr]',
  /* tslint:enable */
  templateUrl: './repair-plan-detail-table-td.component.html',
  styleUrls: ['./repair-plan-detail-table-td.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepairPlanDetailTableTdComponent implements OnInit, OnDestroy {
  @Input() plan_data_id: string;
  @Input() history_data_id: string;
  public plan_data: RepairPlanSingleDataInterface = null;
  public history_data: RepairHistorySingleDataInterface = null;
  public detail_data: RepairHistoryDataDetailInterface = null;
  public sub1: Subscription;
  public sub2: Subscription;
  public sub3: Subscription;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
    const observable1 = this.store.select(state => get_obj_from_array_by_id(
      state.repair_history_collect.repair_plan_data,
      this.plan_data_id).obj);
    const observable2 = this.store.select(state => get_obj_from_array_by_id(
      state.repair_history_collect.repair_history_data,
      this.history_data_id
    ).obj);
    const observable3 = this.store.select(state => get_obj_from_array_by_id(
      state.repair_history_collect.repair_detail_data,
      this.history_data_id
    ).obj);
    this.sub1 = observable1.subscribe(value => {
      value ? this.plan_data = value : this.plan_data = null;
    });
    this.sub2 = observable2.subscribe(value => {
      value ? this.history_data = value : this.history_data = null;
    });
    this.sub3 = observable3.subscribe(value => {
      value ? this.detail_data = value : this.detail_data = null;
    });
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
  }

}
