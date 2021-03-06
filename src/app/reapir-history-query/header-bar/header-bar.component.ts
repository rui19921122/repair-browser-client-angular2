import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Observable} from 'rxjs/Observable';
import {
  RepairHistoryQueryStoreInterface,
  RepairHistoryQueryStoreActions as actions
} from '../store/repair-history-query.store';
import {RepairHistoryQueryConnectWithServerService} from '../../../services/repair-query-get-data-from-server.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
  public date_bar_form: FormGroup;
  public date_bar_form_start_time = new FormControl();
  public date_bar_form_end_time = new FormControl();
  public repair_history_query_store: Observable<RepairHistoryQueryStoreInterface>;

  constructor(public store: Store<AppState>,
              public api_service: RepairHistoryQueryConnectWithServerService,) {
    this.repair_history_query_store = this.store.select(state => state.repair_history_query);
    Observable.of(1).withLatestFrom(this.repair_history_query_store).subscribe(
      (value: [number, RepairHistoryQueryStoreInterface]) => {
        const store_value = value[1];
        this.date_bar_form_start_time.setValue(store_value.start_time.toDate());
        this.date_bar_form_end_time.setValue(store_value.end_time.toDate());
      }
    );
    this.date_bar_form = new FormGroup({});
    this.date_bar_form.addControl('start', this.date_bar_form_start_time);
    this.date_bar_form.addControl('end', this.date_bar_form_end_time);
    this.date_bar_form.valueChanges.subscribe(
      value => {
        this.store.dispatch(new actions.UpdateHeaderFormStartAndEndDate({
          start: value['start'],
          end: value['end']
        }));
      }
    );
  }

  ngOnInit() {
  }

  public query() {
    Observable.of(null).withLatestFrom(this.repair_history_query_store).subscribe(
      (store: [null, RepairHistoryQueryStoreInterface]) => {
        this.api_service.get_repair_history_data_from_server(
          store[1].start_time,
          store[1].end_time,
        );
      }
    );
  }

}
