import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-repair-history-collect-index',
  templateUrl: './repair-history-collect-index.component.html',
  styleUrls: ['./repair-history-collect-index.component.css']
})
export class RepairHistoryCollectIndexComponent implements OnInit {
  @Input() is_login: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

}
