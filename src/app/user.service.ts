import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {MdSnackBar} from '@angular/material';
import {HttpModule, Http} from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {SystemUserInterface} from './api';
import {Selector, Store, Action, State} from '@ngrx/store';
import {AppState} from './store';

@Injectable()
export class UserService {
  public login_end: Subject<boolean> = new Subject();
  public user: UserStoreInterface;

  constructor(public http: Http, public snackBar: MdSnackBar, public store: Store<AppState>) {
    this.store.select('user').subscribe(v => this.user = v);
    this.login_end.subscribe(() => {
      this.store.dispatch(new SwitchLoginPending(false));
    });
    this.get_login_status();
  }

  public get_login_status() {
    this.store.dispatch(new SwitchLoginPending(true));
    this.http.get('/api/system-user/system-user/').subscribe(v => {
      this.login_end.next(true);
      const json: SystemUserInterface = v.json();
      this.store.dispatch(new UpdateUserName({username: json.username, department: json.department}));
    }, () => {
      this.login_end.next(true);
    });
  }

  public login(username: string, password: string) {
    if (password === '' || username === '') {
      this.snackBar.open('请输入有效的用户名密码', 'X', {duration: 2000});
      return;
    } else {
    }
    this.store.dispatch(new SwitchLoginPending(true));
    this.http.post('/api/system-user/login/',
      {
        username: username, password: password
      },
      {withCredentials: true}
    ).subscribe(v => {
      const json = v.json();
      this.store.dispatch(new UpdateUserName({username: json['username'], department: json['department']}));
      this.login_end.next(true);
    }, (err) => {
      const json = err.json();
      this.snackBar.open(json['error'] || `发生错误`, 'X', {duration: 2000});
      this.login_end.next(false);
    });
  }
}

export const REPLACE_BY_USER_SERVICE = '[user]REPLACE_BY_USER_SERVICE';
export const UPDATE_USER_NAME = '[user]UPDATE_USER_NAME';
export const SWITCH_LOGIN_PENDING = '[user]SWITCH_LOGIN_PENDING';

export class SwitchLoginPending implements Action {
  readonly type = SWITCH_LOGIN_PENDING;

  constructor(public payload: boolean) {
  }
}

export class ReplaceByUserService implements Action {
  readonly type = REPLACE_BY_USER_SERVICE;

  constructor(public payload: UserStoreInterface) {

  }
}

export class UpdateUserName implements Action {
  readonly type = UPDATE_USER_NAME;

  constructor(public payload: { username: string; department: string }) {
  }
}

export type UserAction = ReplaceByUserService
  | UpdateUserName
  | SwitchLoginPending;
const actions = {
  ReplaceByUserService,
  UpdateUserName,
  SwitchLoginPending

};

export interface UserStoreInterface {
  is_login: boolean;
  username?: string;
  department?: string;
  should_login_modal_open?: boolean;
  login_pending: boolean;
}

const default_state: UserStoreInterface = {
  is_login: false,
  login_pending: false,
  should_login_modal_open: false
};

export function reducer(state: UserStoreInterface = default_state, action: UserAction) {
  switch (action.type) {
    case REPLACE_BY_USER_SERVICE:
      return action.payload;
    case UPDATE_USER_NAME:
      return {...state, username: action.payload.username, department: action.payload.department, is_login: true};
    case SWITCH_LOGIN_PENDING:
      return {...state, login_pending: action.payload};
    default:
      return state;
  }
}

export default reducer;
