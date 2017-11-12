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


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit, OnDestroy {
  public $state: Observable<RepairHistoryCollectStoreInterface>;
  public $repair_plan_and_history_data: Observable<RepairPlanAndHistoryDataSorted[]>;
  public $repair_plan_data: Observable<{ [id: string]: RepairPlanSingleDataInterface }>;
  public $repair_history_data: Observable<{ [id: string]: RepairHistorySingleDataInterface }>;
  public $not_showed_dates_on_content: Observable<moment.Moment[]>;
  public $showed_date_on_content: Observable<moment.Moment>;
  public $only_show_one_date_on_content: Observable<boolean>;
  public $repair_detail_data: Observable<{ [id: string]: RepairHistoryDataDetailInterface }>;
  @Input('height') height: number;

  constructor(public store: Store<AppState>,
              public repair_history_detail_service: RepairHistoryDetailApiService,
              public http: HttpClient) {
  }

  ngOnInit() {
    this.$state = this.store.select(state => state.repair_history_collect);
    this.$repair_plan_and_history_data = this.store.select(
      state => state.repair_history_collect.repair_plan_and_history_sorted_by_date);
    this.$repair_history_data = this.store.select(state => state.repair_history_collect.repair_history_data);
    this.$repair_plan_data = this.store.select(state => state.repair_history_collect.repair_plan_data);
    this.$not_showed_dates_on_content = this.store.select(state => state.repair_history_collect.content_settings.not_displayed_data);
    this.$showed_date_on_content = this.store.select(state => state.repair_history_collect.content_settings.displayed_data);
    this.$repair_detail_data = this.store.select(state => state.repair_history_collect.repair_detail_data);
    this.$only_show_one_date_on_content = this.store.select(
      state => state.repair_history_collect.content_settings.only_show_on_day_on_content);
  }

  ngOnDestroy() {
  }

  handle_show_all_clicked(boolean) {
    this.store.dispatch(new actions.SwitchShowAllDatesOnDatesHeader(boolean));
  }

  public open_panel(string: 'date_list' | 'date_select') {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenWhichSidebar(string));
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
    let value;
    this.$repair_history_data.take(1).subscribe(
      (v: { [id: string]: RepairHistorySingleDataInterface }) => {
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
}
