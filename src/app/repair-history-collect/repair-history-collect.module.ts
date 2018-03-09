import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckPostDataDialogComponent} from './check-post-data-dialog/check-post-data-dialog.component';
import {RepairCollectEditDataDialogComponent} from './repair-collect-edit-data-dialog/repair-collect-edit-data-dialog.component';
import {RepairHistoryCollectContentComponent} from './repair-history-collect-content/repair-history-collect-content.component';
import {RepairHistoryCollectIndexComponent} from './repair-history-collect-index/repair-history-collect-index.component';
import {RepairHistoryCollectSideBarComponent} from './repair-history-collect-side-bar/repair-history-collect-side-bar.component';
import {RepairPlanEditTableTdComponent} from './repair-plan-detail-table/repair-plan-detail-table.component';
import {RepairPlanDetailTableTdComponent} from './repair-plan-detail-table-td/repair-plan-detail-table-td.component';
import {RepairHistoryCollectComponent} from './repair-history-collect.component';
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSelectModule, MatSidenavModule,
  MatSnackBarModule, MatTableModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MomentPipe} from '../../pipes/moment.pipe';
import {SplitLongSentenceWithColon} from '../../pipes/split-long-sentence-with-colon.pipe';
import {FilterSelectedDateFromMappedListPipe} from '../../pipes/filter-selected-date-from-mapped-list.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatTableModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CheckPostDataDialogComponent,
    RepairCollectEditDataDialogComponent,
    RepairHistoryCollectSideBarComponent,
    RepairHistoryCollectContentComponent,
    RepairCollectEditDataDialogComponent,
    RepairHistoryCollectIndexComponent,
    RepairPlanDetailTableTdComponent,
    RepairPlanEditTableTdComponent,
    RepairHistoryCollectComponent,
    MomentPipe,
    SplitLongSentenceWithColon,
    FilterSelectedDateFromMappedListPipe,
  ],
  entryComponents: [
    RepairCollectEditDataDialogComponent
  ],
  bootstrap: [RepairHistoryCollectComponent]
})
export class RepairHistoryCollectModule {
}
