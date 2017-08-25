import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../user.service';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import {Observer, Subject} from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  public filterUsernames: string[];
  public valueChange: Subject<string> = new Subject();

  constructor(public UserService: UserService, public http: Http) {
    this.valueChange.debounceTime(1000).filter(v => v !== '').subscribe(v => {
      this.http.get('/api/system-user/username-autocomplete/', {params: {value: v}})
        .subscribe(json => {
          this.filterUsernames = json.json()['values'];
        });
    });
  }

  ngOnInit() {
  }

  login(username: string, password: string) {
    this.UserService.login(username, password);
  }

  input_change(username: string) {
    this.valueChange.next(username);
  }

}
