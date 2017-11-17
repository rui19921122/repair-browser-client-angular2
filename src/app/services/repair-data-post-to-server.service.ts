import {Injectable} from '@angular/core';
import {SaveDataToServerApiInterface, QueryDataConflictFromServerRequestApi, QueryDataConflictFromServerResponseApi} from '../api';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {RepairHistoryCollectStoreInterface} from '../repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';

import {get_csrf_token} from '../util_func';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class RepairDataPostToServerService {

  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar) {
  }

  public post_data_to_services() {
    Observable.of(null).withLatestFrom(this.store.select(state => state.repair_history_collect)).subscribe(
      (value: [null, RepairHistoryCollectStoreInterface]) => {
        const state = value[1];
        const query_data: QueryDataConflictFromServerRequestApi = {data: {date: []}};
        for (const i of state.repair_plan_and_history_sorted_by_date) {
          query_data.data.date.push(i.date.format('YYYYMMDD'));
        }
        this.http.post<QueryDataConflictFromServerResponseApi>('api/data/check-repair-conflict-date',
          query_data
          ,
          {
            withCredentials: true,
            headers: {'X-CSRFToken': get_csrf_token()}
          }
        ).subscribe(
          (v) => {
            this.http.post('api/data/post-repair-data/',
              {data: state.repair_plan_and_history_sorted_by_date},
              {
                withCredentials: true,
                headers: {'X-CSRFToken': get_csrf_token()}
              }
            )
              .subscribe(v => console.log(v));
          }, (error) => {
            this.snack_bar.open('oppppps，出错了', '朕知道了', {duration: 3000});
          },
        );
      }
    );
  }

}
