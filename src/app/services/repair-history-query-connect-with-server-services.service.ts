import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import * as moment from 'moment';

@Injectable()
export class RepairHistoryQueryConnectWithServerServicesService {

  constructor(public httpClient: HttpClient,
              public store: Store<AppState>) {
  }

  public get_repair_history_data_from_server(start_time: moment.Moment, end_time: moment.Moment) {
  }

}
