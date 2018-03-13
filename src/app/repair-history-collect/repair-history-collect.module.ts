import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckPostDataDialogComponent} from './check-post-data-dialog/check-post-data-dialog.component';
import {EditDataDialogComponent} from './edit-data-dialog/edit-data-dialog.component';
import {ContentComponent} from './content/content.component';
import {IndexComponent} from './index/index.component';
import {SideBarComponent} from './side-bar/side-bar.component';
import {EditTableTdComponent} from './table/table.component';
import {TableTdComponent} from './table-td/table-td.component';
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
import { NotLoginPageComponent } from './not-login-page/not-login-page.component';

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
    EditDataDialogComponent,
    SideBarComponent,
    ContentComponent,
    EditDataDialogComponent,
    IndexComponent,
    TableTdComponent,
    RepairHistoryCollectComponent,
    EditTableTdComponent,
    MomentPipe,
    SplitLongSentenceWithColon,
    FilterSelectedDateFromMappedListPipe,
    NotLoginPageComponent,
  ],
  entryComponents: [
    EditDataDialogComponent
  ],
  bootstrap: [RepairHistoryCollectComponent]
})
export class RepairHistoryCollectModule {
}
