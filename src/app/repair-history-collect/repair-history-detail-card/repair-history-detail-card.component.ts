import {ChangeDetectionStrategy, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {
  RepairHistoryCollectStoreActions as actions,
  RepairHistoryDetailDataStoreInterface,
  RepairHistoryDataStoreInterface
} from '../repair-history-collect.store';
import {RepairHistoryDetailApiService} from '../../../services/repair-collect-get-history-detail-data-from-server.service';
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
  @Input() history_data: RepairHistoryDataStoreInterface;
  @Input() single_dog_card = false; // 是否为单身卡
  @Input() detail_data: RepairHistoryDetailDataStoreInterface;
  public history_data_list: Observable<string[]>;

  constructor(public service: RepairHistoryDetailApiService,
              public store: Store<AppState>) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  public get_history_detail(value: RepairHistoryDataStoreInterface, event: Event) {
    this.service.get_history_detail_by_id(value);
    return false;
  }

  public open_change_dialog(id: string) {
    this.store.dispatch(new actions.EditDataById({dialog_type: 'history', dialog_id: id}));
  }

}
