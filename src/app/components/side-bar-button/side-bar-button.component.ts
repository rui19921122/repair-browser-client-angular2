import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {logging} from 'selenium-webdriver';
import * as _ from 'lodash';

@Component({
  selector: 'app-side-bar-button',
  templateUrl: './side-bar-button.component.html',
  styleUrls: ['./side-bar-button.component.css']
})
export class SideBarButtonComponent implements OnInit {
  @Input() tool_tip = '';
  @Output() on_click: EventEmitter<boolean> = new EventEmitter();
  @Input() icon_name: string;
  @Input() disabled = false;
  public convert_icon_name;

  constructor() {
  }

  ngOnInit() {
    this.convert_icon_name = 'icon-' + this.icon_name;
  }

  handle_click() {
    this.on_click.next(true);
  }
}
