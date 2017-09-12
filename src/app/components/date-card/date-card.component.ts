import * as moment from 'moment';


import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-date-card',
  templateUrl: './date-card.component.html',
  styleUrls: ['./date-card.component.css']
})
export class DateCardComponent implements OnInit {
  @Input('date') date: { date: moment.Moment, display_message: string[] };
  @Input('disabled') disabled: boolean;
  @Input('type') type: 'normal' | 'warn';
  public color = 'black';

  constructor() {
    this.disabled = false;
  }

  ngOnInit() {
  }

}
