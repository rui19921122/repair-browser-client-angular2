import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {end_time_should_later_than_start_time} from '../../util_func';
import {
  RepairHistoryDataDetailInterface,
  RepairHistorySingleDataInterface,
  RepairHistoryCollectStoreActions as actions
} from '../repair-history-collect.store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Actions} from '@ngrx/store-devtools/src/reducer';

@Component({
  selector: 'app-repair-history-edit-dialog',
  templateUrl: './repair-history-edit-dialog.component.html',
  styleUrls: ['./repair-history-edit-dialog.component.css'],
})
export class RepairHistoryEditDialogComponent implements OnInit {
  public origin_history_plan_data: RepairHistorySingleDataInterface;
  public origin_history_detail_data: RepairHistoryDataDetailInterface;
  public form_data: FormGroup;

  constructor(public store: Store<AppState>,
              public fb: FormBuilder) {
    this.store.select(
      state => state.repair_history_collect.repair_history_data[state.repair_history_collect.dialog_settings.dialog_id]).subscribe(
      v => this.origin_history_plan_data = v
    ).unsubscribe();
    this.store.select(
      state => state.repair_history_collect.repair_detail_data[state.repair_history_collect.dialog_settings.dialog_id]
    ).subscribe(v => this.origin_history_detail_data = v).unsubscribe();
    this.form_data = this.fb.group({
      number: [''],
      canceled: [''],
      start_time: [''],
      end_time: [''],
      person: [''],
      start_number: [''],
      end_number: ['']
    });
    this.form_data.setValue(
      {
        number: this.origin_history_plan_data.number,
        canceled: false,
        start_time: '',
        end_time: '',
        person: '',
        start_number: [''],
        end_number: ['']
      }
    );
  }

  ngOnInit() {
  }

  public get_resolved_number(number: string): string {
    const spited = number.split('-');
    if (spited.length === 2) {
      return spited[1];
    } else {
      return '解析失败';
    }
  }

  public close() {
    this.store.dispatch(new actions.OpenOrCloseADialog({dialog_type: ''}));
  }

}
