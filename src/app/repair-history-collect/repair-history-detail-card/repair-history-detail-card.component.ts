import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RepairHistoryDataDetailInterface, RepairHistorySingleDataInterface} from '../repair-history-collect.store';
import {RepairHistoryDetailApiService} from '../../services/repair-history-detail-api.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-repair-history-detail-card',
  templateUrl: './repair-history-detail-card.component.html',
  styleUrls: ['./repair-history-detail-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepairHistoryDetailCardComponent implements OnInit, OnDestroy {
  @Input() history_data_observable: Observable<RepairHistorySingleDataInterface>;
  @Input() single_dog_card = false; // 是否为单身卡
  @Input() detail_data_observable: Observable<RepairHistoryDataDetailInterface>;
  public history_data = <RepairHistorySingleDataInterface>null;
  public detail_data = <RepairHistoryDataDetailInterface>null;
  public history_data_un: Subscription;
  public detail_data_un: Subscription;

  constructor(public service: RepairHistoryDetailApiService) {
  }

  ngOnDestroy() {
    if (this.history_data_un) {
      this.history_data_un.unsubscribe();
    }
    if (this.detail_data_un) {
      this.detail_data_un.unsubscribe();
    }
  }

  ngOnInit() {
    this.history_data_un = this.history_data_observable.subscribe(v => this.history_data = v);
    if (this.detail_data_observable) {
      this.detail_data_un = this.detail_data_observable.subscribe(v => this.detail_data = v);
    }
  }

  public get_history_detail(value: RepairHistorySingleDataInterface) {
    this.service.get_history_detail_by_id(value);
  }

}
