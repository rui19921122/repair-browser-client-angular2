import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';
import {RepairHistoryCollectStoreInterface} from '../repair-history-collect.store';
import {RepairPlanSingleDataInterface} from '../../api';
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
  public state: RepairHistoryCollectStoreInterface;
  public $repair_data: Observable<RepairPlanSingleDataInterface[]>;
  public includes_dates: moment.Moment[] = [];

  constructor(public store: Store<AppState>,) {
    const $state = store.select(state2 => state2.repair_history_collect);
    $state.subscribe(value => {
      this.state = value;
    });
    this.$repair_data = store.select(state2 => state2.repair_history_collect.repair_plan_data);
    this.$repair_data.subscribe(v => {
      const observable = Observable.from(v);
      observable.pluck('date').distinct().subscribe((value: string) => this.includes_dates.push(moment(value, 'YYYYMMDD')));
    });
  }

  sortedDates() {
    return this.includes_dates.sort((a, b) => a.isSameOrBefore(b) ? -1 : 1);
  }

  ngOnInit() {

  }

}
