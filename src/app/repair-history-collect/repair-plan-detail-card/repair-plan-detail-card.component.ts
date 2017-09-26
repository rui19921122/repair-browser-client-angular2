import {Component, Input, OnInit} from '@angular/core';
import {RepairPlanSingleDataInterface} from '../repair-history-collect.store';
import {MdDialog} from '@angular/material';
import {RepairPlanDialogComponent} from '../repair-plan-dialog/repair-plan-dialog.component';

@Component({
    selector: 'app-repair-plan-detail-card',
    templateUrl: './repair-plan-detail-card.component.html',
    styleUrls: ['./repair-plan-detail-card.component.css']
})
export class RepairPlanDetailCardComponent implements OnInit {
    @Input() plan_data = <RepairPlanSingleDataInterface>null;

    constructor(public dialog: MdDialog) {
    }

    ngOnInit() {
    }

    open_change_dialog() {
        this.dialog.open(RepairPlanDialogComponent, {width: '700px'});
    }
}
