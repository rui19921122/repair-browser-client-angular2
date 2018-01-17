import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';

@Component({
  selector: 'app-repair-collect-edit-data-dialog',
  templateUrl: './repair-collect-edit-data-dialog.component.html',
  styleUrls: ['./repair-collect-edit-data-dialog.component.css']
})
export class RepairCollectEditDataDialogComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  constructor(public fb: FormBuilder,
              public store: Store<AppState>) {
  }

  ngOnInit() {
    console.log('edit dialog create');
  }

  ngOnDestroy() {
    console.log('edit dialog destroy');
  }

}
