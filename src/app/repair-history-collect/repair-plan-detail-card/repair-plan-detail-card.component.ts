import {Component, Input, OnInit} from '@angular/core';
import {RepairPlanSingleDataInterface} from '../repair-history-collect.store';

@Component({
  selector: 'app-repair-plan-detail-card',
  templateUrl: './repair-plan-detail-card.component.html',
  styleUrls: ['./repair-plan-detail-card.component.css']
})
export class RepairPlanDetailCardComponent implements OnInit {
  @Input() plan_data = <RepairPlanSingleDataInterface>null;

  constructor() {
  }

  ngOnInit() {
  }

}
