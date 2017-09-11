import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AppState} from '../../store';
import {Store,createFeatureSelector ,createSelector ,MemoizedSelector} from '@ngrx/store';
import {
  RepairHistoryCollectStoreInterface, RepairHistoryCollectStoreActions as actions,
  RepairPlanSingleDataInterface
} from '../repair-history-collect.store';
import {RepairPlanSingleDataApiInterface} from '../../api';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {DateCardInterface} from '../../components/date-card/date-card.component';


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

  constructor(public store: Store<AppState>) {
    this.$state = this.store.select(state => state.repair_history_collect);
  }

  getDatesData(repair_data: RepairPlanSingleDataInterface[]): { date: moment.Moment, display_message: string }[] {
    const _data = [];
    const _returned_data = [];
    const observable = Observable.from(repair_data);
    observable.pluck('date').distinct().subscribe((value: string) => _data.push(moment(value)));
    return _data.sort((a, b) => a.isSameOrBefore(b) ? -1 : 1);
  }

  ngOnInit() {

  }

  handle_show_all_clicked(boolean) {
    this.store.dispatch(new actions.SwitchShowAllDatesOnDatesHeader(boolean));
  }
}
