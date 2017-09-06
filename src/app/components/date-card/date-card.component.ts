import * as moment from 'moment';

export interface DateCardInterface {
  date: moment.Moment;
  labels: string[];
}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-date-card',
  templateUrl: './date-card.component.html',
  styleUrls: ['./date-card.component.css']
})
export class DateCardComponent implements OnInit {
  @Input('date') date: moment.Moment;

  constructor() {
  }

  ngOnInit() {
  }

}
