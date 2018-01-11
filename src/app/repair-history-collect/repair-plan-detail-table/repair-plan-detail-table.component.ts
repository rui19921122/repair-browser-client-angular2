import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Subscription} from 'rxjs/Subscription';
import {
  RepairHistoryDataDetailInterface,
  RepairHistorySingleDataInterface,
  RepairPlanAndHistoryDataSorted,
  RepairPlanSingleDataInterface
} from '../repair-history-collect.store';
import {add_or_change_obj_from_array_by_id, get_obj_from_array_by_id} from '../../util_func';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-repair-plan-detail-table',
  templateUrl: './repair-plan-detail-table.component.html',
  styleUrls: ['./repair-plan-detail-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Native
})
export class RepairPlanEditTableTdComponent implements OnInit {
  public mapped: Observable<RepairPlanAndHistoryDataSorted[]>;
  public plan_data: Observable<RepairPlanSingleDataInterface[]>;
  public history_data: Observable<RepairHistorySingleDataInterface[]>;
  public detail_data: Observable<RepairHistoryDataDetailInterface[]>;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
    this.mapped = this.store.select(state => state.repair_history_collect.repair_plan_and_history_data_mapped);
    this.plan_data = this.store.select(state => state.repair_history_collect.repair_plan_data);
    this.history_data = this.store.select(state => state.repair_history_collect.repair_history_data);
    this.detail_data = this.store.select(state => state.repair_history_collect.repair_detail_data);
  }

}
