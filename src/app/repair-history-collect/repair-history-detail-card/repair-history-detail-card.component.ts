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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepairHistoryDetailCardComponent implements OnInit, OnDestroy {
  @Input() history_data: RepairHistorySingleDataInterface;
  @Input() single_dog_card = false; // 是否为单身卡
  @Input() detail_data: RepairHistoryDataDetailInterface;
  public history_data_un: Subscription;
  public detail_data_un: Subscription;

  constructor(public service: RepairHistoryDetailApiService,
              public zone: NgZone,
              public store: Store<AppState>) {
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
  }

  public get_history_detail(value: RepairHistorySingleDataInterface, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.zone.runOutsideAngular(
      () => this.service.get_history_detail_by_id(value)
    );
    return false;
  }

  public open_change_dialog(id: string) {
    this.store.dispatch(new actions.OpenOrCloseADialog({dialog_type: 'repair_history', dialog_id: id}));
  }

}
