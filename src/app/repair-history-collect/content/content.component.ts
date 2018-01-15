import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy, Input} from '@angular/core';
import {AppState} from '../../store';
import {Store, createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import {
  RepairHistoryCollectStoreInterface,
  RepairHistoryCollectStoreActions as actions,
  RepairPlanSingleDataInterface,
  RepairHistorySingleDataInterface,
  RepairPlanAndHistoryDataSorted, RepairHistoryCollectStoreActions, RepairHistoryDataDetailInterface
} from '../repair-history-collect.store';
import {RepairPlanSingleDataApiInterface} from '../../api';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Http} from '@angular/http';
import {RepairHistoryDetailApiService} from '../../services/repair-history-detail-api.service';
import {HttpClient} from '@angular/common/http';
import {RepairDataPostToServerService} from '../../services/repair-data-post-to-server.service';
import {RepairCollectGetDataFromServerService} from '../../services/repair-collect-get-data-from-server.service';
import {pipeDef} from '@angular/core/src/view';
import {PipeResolver} from '@angular/compiler';
import {FilterSelectedDateFromMappedListPipe} from '../../pipes/filter-selected-date-from-mapped-list.pipe';
import {get_obj_from_array_by_id} from '../../util_func';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit, OnDestroy {
  public $repair_plan_and_history_data: Observable<RepairPlanAndHistoryDataSorted[]>;
  public repair_plan_and_history_data: RepairPlanAndHistoryDataSorted[] = [];
  public repair_plan_and_history_data_sub: Subscription;
  public $repair_plan_data: Observable<RepairPlanSingleDataInterface[]>;
  public $repair_history_data: Observable<RepairHistorySingleDataInterface[]>;
  public $repair_detail_data: Observable<RepairHistoryDataDetailInterface[]>;
  public $repair_detail_data_list: Observable<Set<string>>;
  public repair_detail_data_list: Set<string>;
  public repair_detail_data_list_sub: Subscription;
  public $display_detail_method: Observable<string>;
  public display_detail_method: string;
  public display_detail_method_sub: Subscription;
  public $not_showed_dates_on_content: Observable<moment.Moment[]>;
  public not_showed_dates_on_content: moment.Moment[];
  public not_showed_dates_on_content_sub: Subscription;
  public $showed_date_on_content: Observable<moment.Moment>;
  public showed_date_on_content: moment.Moment;
  public showed_date_on_content_sub: Subscription;
  public $only_show_one_date_on_content: Observable<boolean>;
  public only_show_one_date_on_content: boolean;
  public only_show_one_date_on_content_sub: Subscription;
  @Input('height') height: number;

  constructor(public store: Store<AppState>,
              public cd: ChangeDetectorRef,
              public repair_history_detail_service: RepairHistoryDetailApiService,
              public post_data_to_server_service: RepairDataPostToServerService,
              public repair_collect_get_data_from_server_service: RepairCollectGetDataFromServerService,
              public http: HttpClient,
              public filterSelectedDateFromMappedListPipe: FilterSelectedDateFromMappedListPipe) {
  }

  // 正在从服务器获取详情的历史条目数
  get repair_detail_data_list_length(): number {
    return this.repair_detail_data_list.size;

  }

  ngOnInit() {
    this.$display_detail_method = this.store.select(state => state.repair_history_collect.content_settings.show_detail_method);
    this.display_detail_method_sub = this.$display_detail_method.subscribe(value => {
      this.display_detail_method = value;
      this.cd.markForCheck();
    });
    this.$repair_detail_data_list = this.repair_history_detail_service.loading_subject;
    this.repair_detail_data_list_sub = this.$repair_detail_data_list.subscribe(value => {
      this.repair_detail_data_list = value;
      this.cd.markForCheck();
    });
    this.$repair_plan_and_history_data = this.store.select(
      state => state.repair_history_collect.repair_plan_and_history_data_mapped);
    this.repair_plan_and_history_data_sub = this.$repair_plan_and_history_data.subscribe(value => {
      this.repair_plan_and_history_data = value;
      this.cd.markForCheck();
    });
    this.$repair_history_data = this.store.select(state => state.repair_history_collect.repair_history_data);
    this.$repair_plan_data = this.store.select(state => state.repair_history_collect.repair_plan_data);
    this.$not_showed_dates_on_content = this.store.select(state => state.repair_history_collect.content_settings.not_displayed_data);
    this.not_showed_dates_on_content_sub = this.$not_showed_dates_on_content.subscribe(value => {
      this.not_showed_dates_on_content = value;
      this.cd.markForCheck();
    });
    this.$showed_date_on_content = this.store.select(state => state.repair_history_collect.content_settings.displayed_data);
    this.showed_date_on_content_sub = this.$showed_date_on_content.subscribe(value => {
      this.showed_date_on_content = value;
      this.cd.markForCheck();
    });
    this.$repair_detail_data = this.store.select(state => state.repair_history_collect.repair_detail_data);
    this.$only_show_one_date_on_content = this.store.select(
      state => state.repair_history_collect.content_settings.only_show_on_day_on_content);
    this.only_show_one_date_on_content_sub = this.$only_show_one_date_on_content.subscribe(value => {
      this.only_show_one_date_on_content = value;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.repair_detail_data_list_sub) {
      this.repair_detail_data_list_sub.unsubscribe();
    }
    if (this.display_detail_method_sub) {
      this.display_detail_method_sub.unsubscribe();
    }
    if (this.repair_plan_and_history_data_sub) {
      this.repair_plan_and_history_data_sub.unsubscribe();
    }
    if (this.showed_date_on_content_sub) {
      this.showed_date_on_content_sub.unsubscribe();
    }
    if (this.not_showed_dates_on_content_sub) {
      this.not_showed_dates_on_content_sub.unsubscribe();
    }
    if (this.only_show_one_date_on_content_sub) {
      this.only_show_one_date_on_content_sub.unsubscribe();
    }
  }

  public calc_lost_repair_plan_data() {
    this.repair_collect_get_data_from_server_service.calc_miss_repair_plan_data_by_history_data();
  }

  public open_panel(string: 'date_list' | 'date_select') {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenWhichSidebar(string));
  }

  public change_detail_display_method() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.ChangeShowDetailMethod({}));
  }

  public switch_only_show_one_date_on_content() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOnlyShowOneDateOnContent());
  }


  public get_all_history_detail_data() {
    const list = new Set();
    const already_added_date = new Set();
    const display_date = this.filterSelectedDateFromMappedListPipe.transform(
      this.repair_plan_and_history_data,
      this.showed_date_on_content,
      this.not_showed_dates_on_content,
      this.only_show_one_date_on_content
    );
    let detail_data = [];
    this.$repair_detail_data.subscribe(value => detail_data = value).unsubscribe();
    for (const map_single_day of display_date) {
      already_added_date.add(map_single_day.date);
      for (const i of map_single_day.repair_plan_data_index_on_this_day) {
        if (get_obj_from_array_by_id(detail_data, i.history_number_id).index >= 0) {
        } else {
          list.add(i.history_number_id);
        }
      }
      for (const i of map_single_day.repair_history_data_not_map_in_plan) {
        if (get_obj_from_array_by_id(detail_data, i).index >= 0) {
        } else {
          list.add(i);
        }
      }
    }
    for (const map_single_day of this.repair_plan_and_history_data) {
      if (already_added_date.has(map_single_day.date)) {
      } else {
        already_added_date.add(map_single_day.date);
        for (const i of map_single_day.repair_plan_data_index_on_this_day) {
          if (get_obj_from_array_by_id(detail_data, i.history_number_id).index >= 0) {
          } else {
            list.add(i.history_number_id);
          }
        }
        for (const i of map_single_day.repair_history_data_not_map_in_plan) {
          if (get_obj_from_array_by_id(detail_data, i).index >= 0) {
          } else {
            list.add(i);
          }
        }
      }
    }
    this.repair_history_detail_service.loading_subject.next(list);
  }

  post_data_to_server() {
    this.post_data_to_server_service.post_data_to_services();
  }
}
