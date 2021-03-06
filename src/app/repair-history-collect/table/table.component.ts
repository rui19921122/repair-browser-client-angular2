import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Subscription} from 'rxjs/Subscription';
import {
  RepairDetailDataStoreInterface,
  RepairHistoryDataStoreInterface,
  RepairPlanAndHistoryDataMappedInterface,
  RepairPlanDataStoreInterface
} from '../repair-history-collect.store';
import {add_or_change_obj_from_array_by_id, get_obj_from_array_by_id} from '../../util_func';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {RepairHistoryDetailApiService} from '../../../services/repair-collect-get-history-detail-data-from-server.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Native
})
export class EditTableTdComponent implements OnInit, OnDestroy {
  @Input() only_show_invalid_data: boolean;
  public $mapped: Observable<RepairPlanAndHistoryDataMappedInterface[]>;
  public mapped: RepairPlanAndHistoryDataMappedInterface[];
  public mapped_sub: Subscription;
  public $plan_data: Observable<RepairPlanDataStoreInterface[]>;
  public plan_data: RepairPlanDataStoreInterface[];
  public plan_data_sub: Subscription;
  public $history_data: Observable<RepairHistoryDataStoreInterface[]>;
  public history_data: RepairHistoryDataStoreInterface[];
  public history_data_sub: Subscription;
  public $detail_data: Observable<RepairDetailDataStoreInterface[]>;
  public detail_data: RepairDetailDataStoreInterface[];
  public detail_data_sub: Subscription;
  public $show_one_day_or_all: Observable<boolean>;
  public show_one_day_or_all: boolean;
  public show_one_day_or_all_sub: Subscription;
  public $showed_date: Observable<moment.Moment>;
  public showed_date: moment.Moment;
  public showed_date_sub: Subscription;
  public $not_showed_date: Observable<moment.Moment[]>;
  public not_showed_date: moment.Moment[];
  public not_showed_date_sub: Subscription;
  public $loading_data: Observable<Set<string>>;
  public loading_data: Set<string>;
  public loading_data_sub: Subscription;

  constructor(public store: Store<AppState>,
              public get_detail_service: RepairHistoryDetailApiService,
              public cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.$loading_data = this.get_detail_service.loading_subject;
    this.loading_data_sub = this.$loading_data.subscribe(value => {
      this.loading_data = value;
      this.cd.markForCheck();
    });
    this.$plan_data = this.store.select(state => state.repair_history_collect.repair_plan_data);
    this.plan_data_sub = this.$plan_data.subscribe(value => {
      this.plan_data = value;
      this.cd.markForCheck();
    });
    this.$history_data = this.store.select(state => state.repair_history_collect.repair_history_data);
    this.history_data_sub = this.$history_data.subscribe(value => {
      this.history_data = value;
      this.cd.markForCheck();
    });
    this.$detail_data = this.store.select(state => state.repair_history_collect.repair_detail_data);
    this.detail_data_sub = this.$detail_data.subscribe(value => {
      this.detail_data = value;
      this.cd.markForCheck();
    });
    this.$show_one_day_or_all = this.store.select(state => state.repair_history_collect.content_settings.only_show_on_day_on_content);
    this.show_one_day_or_all_sub = this.$show_one_day_or_all.subscribe(value => {
      this.show_one_day_or_all = value;
      this.cd.markForCheck();
    });
    this.$showed_date = this.store.select(state => state.repair_history_collect.content_settings.displayed_data);
    this.showed_date_sub = this.$showed_date.subscribe(value => {
      this.showed_date = value;
      this.cd.markForCheck();
    });
    this.$not_showed_date = this.store.select(state => state.repair_history_collect.content_settings.not_displayed_data);
    this.not_showed_date_sub = this.$not_showed_date.subscribe(value => {
      this.not_showed_date = value;
      this.cd.markForCheck();
    });
    this.$mapped = this.store.select(state => state.repair_history_collect.repair_plan_and_history_data_mapped);
    this.mapped_sub = this.$mapped.subscribe(value => {
      this.mapped = value;
      this.cd.markForCheck();
    });
  }

  public the_record_is_in_loading(id: string) {
    return this.loading_data.has(id);
  }

  public filter_wrong_data(): { history: string; plan: string }[] {
    const list: { history: string; plan: string }[] = [];
    for (const i of this.mapped) {
      for (const j of i.repair_history_data_not_map_in_plan) {
        list.push({history: j, plan: null});
      }
      for (const j of i.repair_plan_data_index_on_this_day) {
        if (j.valid.valid) {
        } else {
          list.push({plan: j.plan_number_id, history: j.history_number_id});
        }
      }
    }
    return list;
  }

  ngOnDestroy() {
    if (this.loading_data_sub) {
      this.loading_data_sub.unsubscribe();
    }
    if (this.detail_data_sub) {
      this.detail_data_sub.unsubscribe();
    }
    if (this.history_data_sub) {
      this.history_data_sub.unsubscribe();
    }
    if (this.mapped_sub) {
      this.mapped_sub.unsubscribe();
    }
    if (this.plan_data_sub) {
      this.plan_data_sub.unsubscribe();
    }
    if (this.show_one_day_or_all_sub) {
      this.show_one_day_or_all_sub.unsubscribe();
    }
    if (this.not_showed_date_sub) {
      this.not_showed_date_sub.unsubscribe();
    }
    if (this.showed_date_sub) {
      this.showed_date_sub.unsubscribe();
    }
  }

}
