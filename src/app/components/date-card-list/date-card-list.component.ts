import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnDestroy} from '@angular/core';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

export interface DateCardInterface {
  date: moment.Moment;
  display_message: string[];
  type: string;
}

@Component({
  selector: 'app-date-card-list',
  templateUrl: './date-card-list.component.html',
  styleUrls: ['./date-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCardListComponent implements OnInit, OnDestroy {
  @Input('dates') dates: Observable<any[]>;
  @Input('map_func') map_func: (v) => DateCardInterface[];
  @Input('show_all') show_all: Observable<boolean>;
  @Input('show_number') show_number = 7;
  @Output() show_all_card_on_header_is_clicked_output: EventEmitter<boolean> = new EventEmitter();
  public _date: DateCardInterface[];
  public un: Subscription;
  public should_show_more_button = false;
  public should_show_hide_button = false;
  public show_all_un: Subscription;
  public _show_all: boolean;

  constructor(public mark: ChangeDetectorRef) {
  }

  ngOnDestroy() {
    if (this.un) {
      this.un.unsubscribe();
    }
    if (this.show_all_un) {
      this.show_all_un.unsubscribe();
    }
  }

  ngOnInit() {
    this.un = this.dates.withLatestFrom(this.show_all).subscribe(([v1, v2]) => {
      this._date = this.dates_splice(this.map_func(v1), v2);
      this.mark.markForCheck();
    });
    this.show_all_un = this.show_all.withLatestFrom(this.dates).subscribe(([v1, v2]) => {
      this._show_all = v1;
      this._date = this.dates_splice(this.map_func(v2), v1);
      this.mark.markForCheck();
    });
  }

  dates_splice(dates: DateCardInterface[], show_all: boolean) {
    if (dates.length <= this.show_number) {
      this.should_show_more_button = false;
      this.should_show_hide_button = false;
      return dates;
    } else {
      if (this._show_all) {
        this.should_show_more_button = false;
        this.should_show_hide_button = true;
        return dates;
      } else {
        this.should_show_more_button = true;
        this.should_show_hide_button = false;
        return dates.splice(0, this.show_number);
      }
    }
  }

  show_all_card_on_header_is_clicked(payload: boolean) {
    // 为了动画感，延迟100ms发出
    setTimeout(() => this.show_all_card_on_header_is_clicked_output.emit(payload), 100);
  }

}
