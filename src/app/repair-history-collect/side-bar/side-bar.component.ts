import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {
  public state;
  // 组建被销毁时调用，用于销毁所有绑定
  public component_destroyed = new BehaviorSubject<boolean>(false);

  constructor(private store: Store<AppState>,
              public cd: ChangeDetectorRef) {
    store.select(state => state.repair_history_collect).takeUntil(this.component_destroyed)
      .subscribe(value => {
        console.log(value);
        this.state = value;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.component_destroyed.next(true);
    this.component_destroyed.complete();
  }

}
