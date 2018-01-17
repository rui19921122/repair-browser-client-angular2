import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {SystemUserInterface} from '../app/api';
import {Action, Store} from '@ngrx/store';
import {AppState} from '../app/store';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserService {
  public login_end: Subject<boolean> = new Subject();
  public user: UserStoreInterface;

  constructor(public http: HttpClient, public snackBar: MatSnackBar, public store: Store<AppState>) {
    this.store.select('user').subscribe(v => this.user = v).unsubscribe();
    this.login_end.subscribe(() => {
      this.store.dispatch(new SwitchLoginPending(false));
      this.store.dispatch(new SwitchOpenLoginPanel(false));
    });
  }

  public get_login_status() {
    this.store.dispatch(new SwitchLoginPending(true));
    this.http.get('/api/system-user/system-user/').subscribe((v: SystemUserInterface) => {
      this.login_end.next(true);
      const json: SystemUserInterface = v;
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
      const json = v;
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

export const SWITCH_OPEN_LOGIN_PANEL = '[user]SWITCH_OPEN_LOGIN_PANEL';

export class SwitchOpenLoginPanel implements Action {
  readonly type = SWITCH_OPEN_LOGIN_PANEL;

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

export type UserActionType = ReplaceByUserService
  | UpdateUserName
  | SwitchOpenLoginPanel
  | SwitchLoginPending;
export const UserActions = {
  ReplaceByUserService,
  UpdateUserName,
  SwitchLoginPending,
  SwitchOpenLoginPanel
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

export function reducer(state: UserStoreInterface = default_state, action: UserActionType) {
  switch (action.type) {
    case REPLACE_BY_USER_SERVICE:
      return action.payload;
    case UPDATE_USER_NAME:
      return {...state, username: action.payload.username, department: action.payload.department, is_login: true};
    case SWITCH_LOGIN_PENDING:
      return {...state, login_pending: action.payload};
    case SWITCH_OPEN_LOGIN_PANEL:
      return {...state, should_login_modal_open: action.payload};
    default:
      return state;
  }
}

export default reducer;
