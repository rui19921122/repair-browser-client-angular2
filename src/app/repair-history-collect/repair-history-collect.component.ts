import {Component, OnInit, ViewChild, ViewChildren, AfterViewInit} from '@angular/core';
import {UserService} from '../user.service';
import {MdSidenav} from '@angular/material';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup} from '@angular/forms';

class ButtonType {
  text: string;
  type: 'length' | 'month';
  value: number;
}

@Component({
  selector: 'app-repair-history-collect',
  templateUrl: './repair-history-collect.component.html',
  styleUrls: ['./repair-history-collect.component.css']
})
export class RepairHistoryCollectComponent implements OnInit, AfterViewInit {
  public page_height: number;
  @ViewChild('sidenav') sidenav: MdSidenav;
  public month_button_choices: [ButtonType, ButtonType];
  public length_button_choices: [ButtonType, ButtonType, ButtonType];
  public DatePickerForm: FormGroup;


  constructor(public user_service: UserService,
              fb: FormBuilder) {
    this.page_height = window.innerHeight - 52;
    this.length_button_choices = [
      {type: 'length', value: 0, text: '一天内'},
      {type: 'length', value: 7, text: '一周内'},
      {type: 'length', value: 30, text: '三十天内'},
    ];
    this.month_button_choices = [
      {type: 'month', value: 0, text: '本周'},
      {type: 'month', value: 1, text: '本月'},
      {type: 'month', value: 2, text: '上月'},
    ];
    this.DatePickerForm = fb.group({
      'start_date': [],
      'end_date': []
    });
    setTimeout(() => this.sidenav.open(), 1000);
    this.DatePickerForm.valueChanges.subscribe(v => console.log(v));
  }

  public change_form_by_button(type: string, value: number) {
    console.log(1234);
  }


  ngOnInit() {
    console.log('created');
  }

  ngAfterViewInit() {
  }

}
