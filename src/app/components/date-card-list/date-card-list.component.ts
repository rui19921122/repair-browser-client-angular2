import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';
import {DateCardInterface} from '../date-card/date-card.component';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';


@Component({
  selector: 'app-date-card-list',
  templateUrl: './date-card-list.component.html',
  styleUrls: ['./date-card-list.component.css']
})
export class DateCardListComponent implements OnInit {
  @Input('dates') dates: moment.Moment[];
  @Input('show_all') show_all = false;
  @Input('show_number') show_number = 10;
  @Output() show_all_card_on_header_is_clicked_output: EventEmitter<boolean> = new EventEmitter();
  public should_show_more_button = false;
  public should_show_hide_button = false;

  constructor() {
  }

  ngOnInit() {
  }

  dates_splice() {
    if (this.dates.length <= this.show_number) {
      this.should_show_more_button = false;
      this.should_show_hide_button = false;
      return this.dates;
    } else {
      if (this.show_all) {
        this.should_show_more_button = false;
        this.should_show_hide_button = true;
        return this.dates;
      } else {
        this.should_show_more_button = true;
        this.should_show_hide_button = false;
        return this.dates.splice(0, this.show_number);
      }
    }
  }

  show_all_card_on_header_is_clicked(payload: boolean) {
    this.show_all_card_on_header_is_clicked_output.emit(payload);
  }

}
