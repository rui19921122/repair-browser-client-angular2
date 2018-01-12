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
              public http: HttpClient) {
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
    this.$repair_detail_data_list = this.store.select(state => state.repair_history_collect.query_repair_detail_list);
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

  handle_show_all_clicked(boolean) {
    this.store.dispatch(new actions.SwitchShowAllDatesOnDatesHeader(boolean));
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

  public which_dates_data_displayed_on_the_content(a: moment.Moment[] | moment.Moment,
                                                   b: RepairPlanAndHistoryDataSorted[],
                                                   display_one: boolean) {
    if (display_one) {
      if (a) {
        return b.filter(value => value.date.isSame(a as moment.Moment));
      } else {
        return b[0] ? [b[0]] : [];
      }
    } else {
      return b.filter(value => (a as moment.Moment[]).findIndex(value2 => value2.isSame(value.date)) < 0);
    }
  }

  public get_all_history_detail_data() {
    // todo 天窗修历史记录目前顺序与用户展示的列表数据不同，需要重新排序，以符合用户感知
    let value;
    this.$repair_history_data.take(1).subscribe(
      (v) => {
        value = v;
      }
    ).unsubscribe();
    const subject = new Subject<RepairHistorySingleDataInterface>();
    const list = Object.keys(value).filter(v1 => value[v1].cached === 0 && (!value[v1].use_paper));

    function* generate_next_value() {
      for (const i of list) {
        yield value[i];
      }
    }

    const generate_next_value_list = generate_next_value();

    subject.subscribe(
      data => {
        this.repair_history_detail_service.get_history_detail_by_id(
          data
        ).subscribe(() => {
            const next = generate_next_value_list.next();
            if (next.done) {
              subject.complete();
            } else {
              subject.next(next.value);
            }
          }
        );
      }
    );
    subject.next(generate_next_value_list.next().value);
  }

  post_data_to_server() {
    this.post_data_to_server_service.post_data_to_services();
  }
}
