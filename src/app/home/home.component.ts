import {Component, OnInit} from '@angular/core';
import {State, Store} from '@ngrx/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public count;

  constructor(public store: Store<any>) {
    this.count = this.store.select(state => state.count);
  }

  ngOnInit() {
  }

  add() {
    this.store.dispatch({type: 'INCREMENT'});
    return false;
  }

}
