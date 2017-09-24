import {
    Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnDestroy,
    ValueProvider
} from '@angular/core';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';
import {RepairPlanAndHistoryDataSorted, RepairHistoryCollectStoreActions as actions} from '../repair-history-collect.store';

@Component({
    selector: 'app-repair-collect-date-card-list',
    templateUrl: './date-card-list.component.html',
    styleUrls: ['./date-card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCardListComponent implements OnInit, OnDestroy {
    @Output() show_all_card_on_header_is_clicked_output: EventEmitter<boolean> = new EventEmitter();
    public dates_collection: Observable<RepairPlanAndHistoryDataSorted[]>;
    public dates_opened_panel: Observable<moment.Moment[]>;
    public $only_show_one_date_on_content: Observable<boolean>;

    constructor(public mark: ChangeDetectorRef,
                public store: Store<AppState>) {
        this.dates_collection = this.store.select(state => state.repair_history_collect.repair_plan_and_history_sorted_by_date);
        this.dates_opened_panel = this.store.select(state => state.repair_history_collect.side_nav_settings.opened_date_index);
        this.$only_show_one_date_on_content = this.store.select(
            state => state.repair_history_collect.content_settings.only_show_on_day_on_content);
    }

    ngOnDestroy() {
    }

    addOrRemoveDateToDatesOpenedPanel(value: moment.Moment, boolean: boolean) {
        this.store.dispatch(new actions.AddOrRemoveDateToOpenedDatePanel({date: value, boolean: boolean}));
    }

    ngOnInit() {
    }

    SwitchWhichDateShouldDisplayOnContent(date: moment.Moment) {
        this.store.dispatch(new actions.UpdateWhichDateShouldDisplayOnContent({date: date}));
    }


}
