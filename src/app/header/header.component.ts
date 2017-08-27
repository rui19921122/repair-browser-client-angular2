import {Component, OnInit, Inject} from '@angular/core';
import {UserService} from '../user.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import {LoginFormComponent} from './login-form/login-form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public dialogRef: MdDialogRef<LoginFormComponent>;
  public dialog_is_opend: boolean;

  constructor(public UserService: UserService, public dialog: MdDialog) {
    this.UserService = UserService;
    this.UserService.login_end.filter(v => v).subscribe(v => {
      if (this.dialog_is_opend) {
        this.dialogRef.close();
      }
    });
  }

  ngOnInit() {
    console.log('header updated');
  }

  public OpenLoginForm() {
    this.dialogRef = this.dialog.open(LoginFormComponent, {width: '600px', height: '350px'});
    this.dialog_is_opend = true;
    this.dialogRef.afterClosed().subscribe(v => this.dialog_is_opend = false);
  }

}
