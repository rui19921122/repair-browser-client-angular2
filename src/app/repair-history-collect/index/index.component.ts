import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../store';
import {Store} from '@ngrx/store';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {componentDestroyed} from '../../util_func';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  @Input() page_height: number;
  public has_login: boolean;

  constructor(private store: Store<AppState>,
              public cd: ChangeDetectorRef) {
    store.select(state => state.user.is_login).takeUntil(componentDestroyed(this)).subscribe(value => {
      this.has_login = value;
      console.log(this.has_login);
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
