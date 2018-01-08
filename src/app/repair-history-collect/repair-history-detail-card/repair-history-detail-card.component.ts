import {ChangeDetectionStrategy, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {
  RepairHistoryCollectStoreActions as actions,
  RepairHistoryDataDetailInterface,
  RepairHistorySingleDataInterface
} from '../repair-history-collect.store';
import {RepairHistoryDetailApiService} from '../../services/repair-history-detail-api.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-repair-history-detail-card',
  templateUrl: './repair-history-detail-card.component.html',
  styleUrls: ['./repair-history-detail-card.component.css'],
})
export class RepairHistoryDetailCardComponent implements OnInit, OnDestroy {
  @Input() history_data: RepairHistorySingleDataInterface;
  @Input() single_dog_card = false; // 是否为单身卡
  @Input() detail_data: RepairHistoryDataDetailInterface;
  public history_data_list: Observable<Set<string>>;

  constructor(public service: RepairHistoryDetailApiService,
              public store: Store<AppState>) {
    this.history_data_list = this.store.select(state => state.repair_history_collect.query_repair_detail_list);
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  public get_history_detail(value: RepairHistorySingleDataInterface, event: Event) {
    this.service.get_history_detail_by_id(value);
    return false;
  }

  public open_change_dialog(id: string) {
    this.store.dispatch(new actions.OpenOrCloseADialog({dialog_type: 'repair_history', dialog_id: id}));
  }

}
