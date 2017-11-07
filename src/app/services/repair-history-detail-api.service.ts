import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {
  RepairHistoryCollectStoreActions as actions,
  RepairHistorySingleDataInterface
} from '../repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';

@Injectable()
export class RepairHistoryDetailApiService {

  constructor(public http: Http, public store: Store<AppState>) {
  }

  public get_history_detail_by_id(value: RepairHistorySingleDataInterface) {
    if (value.use_paper) {
      return Observable.of(1);
    }
    this.store.dispatch(new actions.UpdateGetRepairDetailPending({id: value.id, value: true}));
    const url = '/api/scrapy/history-detail/detail/' + value.inner_id;
    const sub = this.http.get(url, {withCredentials: true}).delay(5000).publish();
    sub.connect();
    sub.subscribe(
      response => {
        const json = response.json();
        console.log(json);
        this.store.dispatch(new actions.UpdateSingleRepairHistoryDetailData(
          {
            id: value.id,
            value: {
              ...json,
              actual_end_time: moment(json['actual_end_time'], 'HH:mm'),
              actual_start_time: moment(json['actual_start_time'], 'HH:mm')
            }
          }
        ));
      }, () => {
      },
      () => {
        this.store.dispatch(new actions.UpdateGetRepairDetailPending({value: false, id: value.id}));
      }
    );
    return sub.mapTo(null);
  }

}
