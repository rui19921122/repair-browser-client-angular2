import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {MdSnackBar} from '@angular/material';
import {HttpModule, Http} from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {SystemUserInterface} from './api';

@Injectable()
export class UserService {
  public is_login: boolean;
  public username: string; // 用户名
  public department: string; // 部门名称
  public pending: boolean; // 是否正在请求
  public login_end: Subject<boolean> = new Subject();

  constructor(public http: Http, public snackBar: MdSnackBar) {
    this.is_login = false;
    this.username = '';
    this.department = '';
    this.login_end.subscribe(v => {
      v ? this.is_login = true : this.is_login = false;
      this.pending = false;
    });
    this.get_login_status();
    console.log('user service reload');
  }

  public get_login_status() {
    this.http.get('/api/system-user/system-user/').subscribe(v => {
      this.login_end.next(true);
      const json: SystemUserInterface = v.json();
      this.username = json.username;
      this.department = json.department;
    }, () => {
      this.login_end.next(false);
    });
  }

  public login(username: string, password: string) {
    if (password === '' || username === '') {
      this.snackBar.open('请输入有效的用户名密码', 'X', {duration: 2000});
      return;
    } else {
    }
    this.pending = true;
    this.http.post('/api/system-user/login/',
      {
        username: username, password: password
      },
      {withCredentials: true}
    ).subscribe(v => {
      this.username = v.json()['username'];
      this.department = v.json()['department'];
      this.login_end.next(true);
    }, (err) => {
      const json = err.json();
      this.snackBar.open(json['error'] || `发生错误`, 'X', {duration: 2000});
      this.login_end.next(false);
    });
  }
}
