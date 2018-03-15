import {ApplicationInitStatus, Component, OnInit} from '@angular/core';
import {RepairHistoryCollectStoreActions} from '../repair-history-collect.store';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
  }

  public open_panel(string: 'date_list' | 'date_select') {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOpenWhichSidebar(string));
  }

  public switch_only_show_one_date_on_content() {
    this.store.dispatch(new RepairHistoryCollectStoreActions.SwitchOnlyShowOneDateOnContent());
  }
}
