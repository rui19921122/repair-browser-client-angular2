import {Component, Input, OnInit} from '@angular/core';
import {RepairHistorySingleDataInterface} from '../repair-history-collect.store';

@Component({
  selector: 'app-repair-history-detail-card',
  templateUrl: './repair-history-detail-card.component.html',
  styleUrls: ['./repair-history-detail-card.component.css']
})
export class RepairHistoryDetailCardComponent implements OnInit {
  @Input() history_data = <RepairHistorySingleDataInterface>null;

  constructor() {
  }

  ngOnInit() {
  }

}
