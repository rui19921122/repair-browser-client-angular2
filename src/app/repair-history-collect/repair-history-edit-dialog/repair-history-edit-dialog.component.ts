import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {Observable} from 'rxjs/Observable';
import {RepairHistoryDataDetailInterface, RepairHistorySingleDataInterface} from '../repair-history-collect.store';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-repair-history-edit-dialog',
  templateUrl: './repair-history-edit-dialog.component.html',
  styleUrls: ['./repair-history-edit-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    this.form_data = this.fb.group({number: ['']});
    this.form_data.setValue(
      {number: this.origin_history_plan_data.number}
    );
    console.log(this.origin_history_plan_data);
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

}
