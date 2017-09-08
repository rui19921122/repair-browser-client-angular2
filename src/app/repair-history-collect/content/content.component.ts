import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';
import {RepairHistoryCollectStoreInterface, RepairHistoryCollectStoreActions as actions} from '../repair-history-collect.store';
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
  public $repair_data: Observable<RepairPlanSingleDataInterface[]>;
  public includes_dates: moment.Moment[] = [];
  public $state: Observable<RepairHistoryCollectStoreInterface>;

  constructor(public store: Store<AppState>) {
    this.$state = this.store.select(state => state.repair_history_collect);
  }

  getDates(repair_data: RepairPlanSingleDataInterface[]) {
    const _data = [];
    const observable = Observable.from(repair_data);
    observable.pluck('date').distinct().subscribe((value: string) => _data.push(moment(value, 'YYYYMMDD')));
    return _data.sort((a, b) => a.isSameOrBefore(b) ? -1 : 1);
  }

  ngOnInit() {

  }

  handle_show_all_clicked(boolean) {
    console.log(1111);
    this.store.dispatch(new actions.SwitchShowAllDatesOnDatesHeader(boolean));
  }
}
