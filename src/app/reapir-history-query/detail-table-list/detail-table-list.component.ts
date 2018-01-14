import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, Subscribable} from 'rxjs/Observable';
import {RepairHistoryQueryDetailDataInterface} from '../store/repair-history-query.store';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {MatSidenavModule, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';

import {ContextmenuType} from '@swimlane/ngx-datatable';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-table-list',
  templateUrl: './detail-table-list.component.html',
  styleUrls: ['./detail-table-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailTableListComponent implements OnInit, OnDestroy {
  public $detail_data: Observable<RepairHistoryQueryDetailDataInterface[]>;
  public columns = [];


  constructor(public store: Store<AppState>) {
    this.$detail_data = this.store.select(state => state.repair_history_query.repair_data_list);
    this.$detail_data.subscribe(value => {
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
