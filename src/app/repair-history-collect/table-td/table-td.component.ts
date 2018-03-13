import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {
  RepairHistoryDetailAPIInterface,
  RepairHistoryDetailApiService
} from '../../../services/repair-collect-get-history-detail-data-from-server.service';
import {
  RepairDetailDataStoreInterface, RepairHistoryDataStoreInterface,
  RepairPlanDataStoreInterface,
  RepairHistoryCollectStoreActions
} from '../repair-history-collect.store';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Subscription} from 'rxjs/Subscription';
import {get_obj_from_array_by_id} from '../../util_func';
import {RepairCollectGetBaseDataFromServerService} from '../../../services/repair-collect-get-base-data-from-server.service';

@Component({
  /* tslint:disable */
  selector: '[app-repair-plan-detail-table-tr]',
  /* tslint:enable */
  templateUrl: './table-td.component.html',
  styleUrls: ['./table-td.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableTdComponent implements OnInit, OnDestroy {
  @Input() plan_data_id: string;
  @Input() history_data_id: string;
  @Input() loading = false;
  @Input() valid: boolean;
  @Input() error: string;
  public plan_data: RepairPlanDataStoreInterface = null;
  public history_data: RepairHistoryDataStoreInterface = null;
  public detail_data: RepairDetailDataStoreInterface = null;
  public sub1: Subscription;
  public sub2: Subscription;
  public sub3: Subscription;

  constructor(public store: Store<AppState>,
              public repair_history_detail_service: RepairHistoryDetailApiService,
              public cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const observable1 = this.store.select(state => get_obj_from_array_by_id(
      state.repair_history_collect.repair_plan_data,
      this.plan_data_id).obj);
    const observable2 = this.store.select(state => get_obj_from_array_by_id(
      state.repair_history_collect.repair_history_data,
      this.history_data_id
    ).obj);
    const observable3 = this.store.select(state => get_obj_from_array_by_id(
      state.repair_history_collect.repair_detail_data,
      this.history_data_id
    ).obj);
    this.sub1 = observable1.subscribe(value => {
      this.cd.markForCheck();
      value ? this.plan_data = value : this.plan_data = null;
    });
    this.sub2 = observable2.subscribe(value => {
      this.cd.markForCheck();
      value ? this.history_data = value : this.history_data = null;
    });
    this.sub3 = observable3.subscribe(value => {
      this.cd.markForCheck();
      value ? this.detail_data = value : this.detail_data = null;
    });
  }

  public edit() {
    if (this.plan_data && this.plan_data.id) {
      this.store.dispatch(new RepairHistoryCollectStoreActions.EditDataById({dialog_type: 'plan', dialog_id: this.plan_data.id}));
    } else {
      this.store.dispatch(new RepairHistoryCollectStoreActions.EditDataById({dialog_type: 'history', dialog_id: this.history_data.id}));
    }
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
    console.log('i am');
  }

  public open_detail_page(inner_id: string) {
    window.open(`http://10.128.20.119:8080/dzdxj/dzdxj/wxdxj/continueWxDxj.faces?wxArg=${inner_id}`);
    return false;
  }
}
