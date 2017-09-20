import * as moment from 'moment';


import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';
import {RepairPlanAndHistoryDataSorted} from '../repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-repair-collect-date-card',
  templateUrl: './date-card.component.html',
  styleUrls: ['./date-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCardComponent implements OnInit, OnDestroy {
  @Input('date') date = <RepairPlanAndHistoryDataSorted>null;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
