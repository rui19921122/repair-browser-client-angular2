import {Component, OnInit, Inject, ChangeDetectionStrategy} from '@angular/core';
import {UserService, UserStoreInterface, UserActions} from '../../services/user.service';
import {MatDialog, MatDialogRef} from '@angular/material';
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
  public dialogRef: MatDialogRef<LoginFormComponent>;
  public dialog_is_opened: boolean;
  public login_pending: Observable<boolean>;
  public is_login: Observable<boolean>;
  public username: Observable<string>;
  public department: Observable<string>;
  public should_login_panel_open: Observable<boolean>;


  constructor(public user_service: UserService,
              public dialog: MatDialog,
              public store: Store<AppState>) {
    this.login_pending = this.store.select(state => state.user.login_pending);
    this.is_login = this.store.select(state => state.user.is_login);
    this.username = this.store.select(state => state.user.username);
    this.department = this.store.select(state => state.user.department);
    this.should_login_panel_open = this.store.select(state => state.user.should_login_modal_open);
    this.should_login_panel_open.subscribe(
      v => {
        if (v) {
          if (this.dialog_is_opened) {
          } else {
            this.OpenLoginForm();
          }
        } else {
          if (this.dialog_is_opened) {
            this.dialogRef.close();
          }
        }
      }
    );
  }

  ngOnInit() {
    this.store.select(state => state.user).take(1).subscribe(value => {
      if (!value.is_login) {
        this.user_service.get_login_status();
      }
    });
  }

  public open() {
    this.store.dispatch(new UserActions.SwitchOpenLoginPanel(true));
  }

  public OpenLoginForm() {
    this.dialogRef = this.dialog.open(LoginFormComponent, {width: '600px', height: '350px', disableClose: true});
    this.dialog_is_opened = true;
    this.dialogRef.afterClosed().subscribe(v => this.dialog_is_opened = false);
  }

}
