import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {componentDestroyed} from '../../util_func';
import {RepairHistoryCollectStoreActions} from '../repair-history-collect.store';
import {Subject} from 'rxjs/Subject';

class TextsFullOfBigger {
  public texts: Subject<string> = new Subject();

  constructor() {
  }

  get observable() {
    return this.texts.bufferCount(5, 1);
  }

  add(value: string) {
    this.texts.next(value);
  }

}

class ButtonType {
  text: string;
  type: 'length' | 'month';
  value: number;
}

@Component({
  selector: 'app-side-nav-datepicker-content',
  templateUrl: './side-nav-datepicker-content.component.html',
  styleUrls: ['./side-nav-datepicker-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavDatepickerContentComponent implements OnInit, OnDestroy {
  public date_picker_form: FormGroup;
  public month_button_choices: [ButtonType, ButtonType];
  public length_button_choices: [ButtonType, ButtonType, ButtonType];

  // 打算实现一个很装逼的消息提示

  constructor(public fb: FormBuilder,
              public store: Store<AppState>,
              public cd: ChangeDetectorRef) {
    // 快速选择栏
    store.select(state => state.repair_history_collect.start_date)
      .takeUntil(componentDestroyed(this)).subscribe(value => {
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
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
    this.date_picker_form = this.fb.group({
      'start_date': [],
      'end_date': []
    });
    this.date_picker_form.setValue({
      'start_date': moment(),
      'end_date': moment()
    });
    this.date_picker_form.valueChanges.subscribe(v => {
      this.store.dispatch(
        new RepairHistoryCollectStoreActions.ChangeSelectedDate(
          {
            start_date: this.date_picker_form.get('start_date').value,
            end_date: this.date_picker_form.get('end_date').value
          }));
    });
  }

  ngOnDestroy() {

  }

  public change_form_by_button(type: string, value: number) {
    let start_date: moment.Moment;
    let end_date: moment.Moment;
    const today = moment().hours(0).minutes(0).seconds(0);
    if (type === 'month') {
      if (value === 0) { // 本周内
        start_date = moment(today).days(1);
        end_date = moment(today);
      } else if (value === 1) {
        start_date = moment(today).date(1);
        end_date = moment(today);
      } else if (value === 2) {
        start_date = moment(today).month(today.month() - 1).date(1);
        end_date = moment(today).date(1).add(-1, 'days');
      }
      this.date_picker_form.setValue({start_date: start_date.toDate(), end_date: end_date.toDate()});

    } else if (type === 'length') {
      start_date = moment(today).add(-value, 'days');
      end_date = moment(today);
      this.date_picker_form.setValue({start_date: start_date.toDate(), end_date: end_date.toDate()});
    }
  }
}
