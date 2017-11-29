import {Component, Input, OnInit} from '@angular/core';
import {UserService, UserStoreInterface, UserActions} from '../../services/user.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Observer, Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  public filterUsernames: string[];
  public valueChange: Subject<string> = new Subject();

  constructor(public UserService: UserService, public http: HttpClient, public store: Store<AppState>) {
    this.valueChange.debounceTime(1000).filter(v => v !== '').subscribe(v => {
      this.http.get('/api/system-user/username-autocomplete/', {params: {value: v}})
        .subscribe(json => {
          this.filterUsernames = json['values'];
        });
    });
  }

  ngOnInit() {
  }

  close() {
    this.store.dispatch(new UserActions.SwitchOpenLoginPanel(false));
  }

  login(username: string, password: string) {
    this.UserService.login(username, password);
  }

  input_change(username: string) {
    this.valueChange.next(username);
  }

}
