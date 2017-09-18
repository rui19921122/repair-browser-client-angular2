import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy, Input} from '@angular/core';
import {AppState} from '../../store';
import {Store, createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import {DateCardInterface} from '../../components/date-card-list/date-card-list.component';
import {
  RepairHistoryCollectStoreInterface,
  RepairHistoryCollectStoreActions as actions,
  RepairPlanSingleDataInterface,
  RepairHistorySingleDataInterface,
  RepairPlanAndHistoryDataSorted, RepairHistoryCollectStoreActions
} from '../repair-history-collect.store';
import {RepairPlanSingleDataApiInterface} from '../../api';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';



@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit, OnDestroy {
  public $state: Observable<RepairHistoryCollectStoreInterface>;
  public $repair_plan_and_history_data: Observable<RepairPlanAndHistoryDataSorted[]>;
  // public MapOriginDataToDateCardData: Function;
  // public $show_all_dates_on_header: Observable<boolean>;
  @Input('height') height: number;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
    this.$state = this.store.select(state => state.repair_history_collect);
    this.$repair_plan_and_history_data = this.store.select(state => state.repair_history_collect.repair_plan_and_history_sorted_by_date);
  }

  ngOnDestroy() {
  }

  handle_show_all_clicked(boolean) {
    this.store.dispatch(new actions.SwitchShowAllDatesOnDatesHeader(boolean));
  }

  public open_panel(string: 'date_list' | 'date_select') {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenWhichSidebar(string));
  }

}
