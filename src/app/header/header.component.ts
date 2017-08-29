import {Component, OnInit, Inject, ChangeDetectionStrategy} from '@angular/core';
import {UserService, UserStoreInterface} from '../user.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import {LoginFormComponent} from './login-form/login-form.component';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  public dialogRef: MdDialogRef<LoginFormComponent>;
  public dialog_is_opend: boolean;
  public login_pending: Observable<boolean>;
  public is_login: Observable<boolean>;
  public username: Observable<string>;
  public department: Observable<string>;


  constructor(public UserService: UserService,
              public dialog: MdDialog,
              public store: Store<AppState>) {
    this.login_pending = this.store.select(state => state.user.login_pending);
    this.is_login = this.store.select(state => state.user.is_login);
    this.username = this.store.select(state => state.user.username);
    this.department = this.store.select(state => state.user.department);
    this.UserService = UserService;
    this.UserService.login_end.filter(v => v === true).subscribe(v => {
      if (this.dialog_is_opend) {
        this.dialogRef.close();
      }
    });
  }

  ngOnInit() {
  }

  public OpenLoginForm() {
    this.dialogRef = this.dialog.open(LoginFormComponent, {width: '600px', height: '350px'});
    this.dialog_is_opend = true;
    this.dialogRef.afterClosed().subscribe(v => this.dialog_is_opend = false);
  }

}
