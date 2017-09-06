import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import * as moment from 'moment';
import {DateCardInterface} from '../date-card/date-card.component';


@Component({
  selector: 'app-date-card-list',
  templateUrl: './date-card-list.component.html',
  styleUrls: ['./date-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCardListComponent implements OnInit {
  @Input('dates') dates: moment.Moment;

  constructor() {
  }

  ngOnInit() {
  }

}
