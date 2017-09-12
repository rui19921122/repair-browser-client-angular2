import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AppState} from '../../store';
import {Store, createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import {DateCardInterface} from '../../components/date-card-list/date-card-list.component';
import {
  RepairHistoryCollectStoreInterface,
  RepairHistoryCollectStoreActions as actions,
  RepairPlanSingleDataInterface,
  RepairHistorySingleDataInterface,
  RepairPlanAndHistoryDataSorted
} from '../repair-history-collect.store';
import {RepairPlanSingleDataApiInterface} from '../../api';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  public $repair_data: Observable<RepairPlanSingleDataApiInterface[]>;
  public includes_dates: moment.Moment[] = [];
  public $state: Observable<RepairHistoryCollectStoreInterface>;
  public _date: any;

  constructor(public store: Store<AppState>) {
    this.$state = this.store.select(state => state.repair_history_collect);
    this._date = {date: moment(), display_message: []};
  }

  getDatesData(data: RepairPlanAndHistoryDataSorted[]): DateCardInterface[] {
    const _date: DateCardInterface[] = [];
    for (const single_data of data) {
      _date.push({
        date: single_data.date,
        display_message: [
          `计划${single_data.repair_plan_data_index_on_this_day.length}条`,
          `实际${single_data.repair_history_data_index_on_this_day.length}条`,
          `匹配${single_data.plan_history_can_match_together.length}条`,
        ],
        type: (( single_data.plan_history_can_match_together.length === single_data.repair_history_data_index_on_this_day.length) &&
          (single_data.plan_history_can_match_together.length === single_data.repair_plan_data_index_on_this_day.length))
          ? 'normal' : 'warn'
      });
    }
    return _date;
  }

  ngOnInit() {

  }

  handle_show_all_clicked(boolean) {
    this.store.dispatch(new actions.SwitchShowAllDatesOnDatesHeader(boolean));
  }
}
