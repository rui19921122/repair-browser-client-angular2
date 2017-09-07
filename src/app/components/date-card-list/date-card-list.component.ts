import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import * as moment from 'moment';
import {DateCardInterface} from '../date-card/date-card.component';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-date-card-list',
  templateUrl: './date-card-list.component.html',
  styleUrls: ['./date-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCardListComponent implements OnInit {
  @Input('dates') dates: Observable<moment.Moment[]>;
  @Input('show_all') show_all = false;
  @Input('show_number') show_number = 10;

  constructor() {
    console.log(this.dates);
  }

  ngOnInit() {
  }

}
