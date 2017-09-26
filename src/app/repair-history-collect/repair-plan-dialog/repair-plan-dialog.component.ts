import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
    selector: 'app-repair-plan-dialog',
    templateUrl: './repair-plan-dialog.component.html',
    styleUrls: ['./repair-plan-dialog.component.css']
})
export class RepairPlanDialogComponent implements OnInit, OnDestroy {

    constructor(public mdDialogRef: MdDialogRef<RepairPlanDialogComponent>) {
        console.log(this.mdDialogRef);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.mdDialogRef.close();
    }

}
