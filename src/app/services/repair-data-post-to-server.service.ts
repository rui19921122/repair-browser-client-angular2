import {Injectable} from '@angular/core';
import {SaveDataToServerApiInterface} from '../api';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';

@Injectable()
export class RepairDataPostToServerService {

  constructor(public http: HttpClient,
              public store: Store<AppState>) {
  }

  public post_data_to_services(data: SaveDataToServerApiInterface) {
  }

}
