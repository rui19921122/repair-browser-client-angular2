// 此服务包含了组件中监听store变化的subscribe
import {Injectable} from '@angular/core';
import {
  SaveDataToServerApiInterface, QueryDataConflictFromServerRequestApi, QueryDataConflictFromServerResponseApi,
  SaveDateToServerContentInterface
} from '../api';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {RepairHistoryCollectStoreInterface} from '../repair-history-collect/repair-history-collect.store';
import {Observable} from 'rxjs/Observable';

import {get_csrf_token, convert_a_HH_mm_like_string_to_a_moment} from '../util_func';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class RepairDataPostToServerService {

  constructor(public http: HttpClient,
              public store: Store<AppState>,
              public snack_bar: MatSnackBar) {
  }


}
