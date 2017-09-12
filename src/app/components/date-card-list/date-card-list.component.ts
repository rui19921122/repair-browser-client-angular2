import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

export interface DateCardInterface {
  date: moment.Moment;
  display_message: string[];
  type: string;
}

@Component({
  selector: 'app-date-card-list',
  templateUrl: './date-card-list.component.html',
  styleUrls: ['./date-card-list.component.css']
})
export class DateCardListComponent implements OnInit {
  @Input('dates') dates: DateCardInterface[];
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
    // 为了动画感，延迟100ms发出
    setTimeout(() => this.show_all_card_on_header_is_clicked_output.emit(payload), 100);
  }

}
