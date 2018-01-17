import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FlexLayoutModule} from '@angular/flex-layout';
import {environment} from '../environments/environment';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
  MatDatepickerModule, MatDialogModule, MatExpansionModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {store} from './store';
import {get__HMR__state} from '../hmr';
import {StoreModule} from '@ngrx/store';
import {HomeComponent} from './home/home.component';
import {UserService} from '../services/user.service';
import {LoginFormComponent} from './header/login-form/login-form.component';
import {HttpClientModule} from '@angular/common/http';

import {RepairHistoryCollectComponent} from './repair-history-collect/repair-history-collect.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {StoreRouterConnectingModule} from '@ngrx/router-store';

import {DateCardListComponent} from './repair-history-collect/repair-collect-date-card-list/date-card-list.component';
import {DateCardComponent} from './repair-history-collect/repair-collect-date-card/date-card.component';
import {ContentComponent} from './repair-history-collect/content/content.component';
import {RepairPlanDetailCardComponent} from './repair-history-collect/repair-plan-detail-card/repair-plan-detail-card.component';
import {RepairHistoryDetailCardComponent} from './repair-history-collect/repair-history-detail-card/repair-history-detail-card.component';
import {MomentPipe} from '../pipes/moment.pipe';
import {InTheMomentListPipe} from '../pipes/in-the-moment-list.pipe';
import {GetDataByIdPipe} from '../pipes/get-data-by-id.pipe';
import {SplitLongSentenceWithColon} from '../pipes/split-long-sentence-with-colon.pipe';
import {MapMomentToRepairPlanAndHistoryDataPipe} from '../pipes/map-moment-to-repair-plan-and-history-data.pipe';
import {RepairHistoryDetailApiService} from '../services/repair-collect-get-history-detail-data-from-server.service';
import {GetChildObjectInObjectByIdPipe} from '../pipes/get-child-object-in-object-by-id.pipe';
import {RepairDataPostToServerService} from '../services/repair-collect-post-data-to-server.service';
import {PrettyprintPipe} from '../pipes/prettyprint.pipe';
import {DiffTimeWithStringFormatPipe} from '../pipes/diff-time-with-string-format.pipe';
import {ReapirHistoryQueryComponent} from './reapir-history-query/reapir-history-query.component';
import {HeaderBarComponent} from './reapir-history-query/header-bar/header-bar.component';
import {RepairHistoryQueryConnectWithServerService} from '../services/repair-query-get-data-from-server.service';
import {DetailTableListComponent} from './reapir-history-query/detail-table-list/detail-table-list.component';
import {RenderShowedTimeWithGivenMomentPipe} from '../pipes/render-showed-time-with-given-moment.pipe';
import {WatchStoreChangeService} from '../services/watch_store_change_sub';
import {SnackBarConfig, SnackBarConfigValue} from '../providers/snack-bar-provider';
import {RepairCollectGetBaseDataFromServerService} from '../services/repair-collect-get-base-data-from-server.service';
import {CountingMappedPlanDataWithoutHistoryPipe} from '../pipes/counting-mapped-plan-data-without-history.pipe';
import {RepairPlanEditTableTdComponent} from './repair-history-collect/repair-plan-detail-table/repair-plan-detail-table.component';
import {RepairPlanDetailTableTdComponent} from './repair-history-collect/repair-plan-detail-table-td/repair-plan-detail-table-td.component';
import {FilterSelectedDateFromMappedListPipe} from '../pipes/filter-selected-date-from-mapped-list.pipe';
import {RepairHistoryMonthQueryComponent} from './repair-history-month-query/repair-history-month-query.component';
import {UseMockData} from '../providers/use-mock-data-provider';
import {RepairCollectEditDataDialogComponent} from './repair-history-collect/repair-collect-edit-data-dialog/repair-collect-edit-data-dialog.component';


export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'repair-history-collect', component: RepairHistoryCollectComponent, pathMatch: 'full'},
  {path: 'repair-history-query', component: ReapirHistoryQueryComponent, pathMatch: 'full'},
  {path: 'test', component: RepairHistoryDetailCardComponent, pathMatch: 'full'},
  {path: 'repair-history-month-query', component: RepairHistoryMonthQueryComponent, pathMatch: 'full'},
];


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HeaderComponent,
    HomeComponent,
    RepairHistoryCollectComponent,
    DateCardListComponent,
    DateCardComponent,
    ContentComponent,
    RepairPlanDetailCardComponent,
    RepairHistoryDetailCardComponent,
    MomentPipe,
    InTheMomentListPipe,
    GetDataByIdPipe,
    MapMomentToRepairPlanAndHistoryDataPipe,
    SplitLongSentenceWithColon,
    GetChildObjectInObjectByIdPipe,
    PrettyprintPipe,
    DiffTimeWithStringFormatPipe,
    ReapirHistoryQueryComponent,
    HeaderBarComponent,
    DetailTableListComponent,
    RenderShowedTimeWithGivenMomentPipe,
    CountingMappedPlanDataWithoutHistoryPipe,
    RepairPlanEditTableTdComponent,
    RepairPlanDetailTableTdComponent,
    FilterSelectedDateFromMappedListPipe,
    RepairHistoryMonthQueryComponent,
    RepairCollectEditDataDialogComponent,
  ],
  imports: [
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatTableModule,
    BrowserModule,
    MatCardModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    StoreRouterConnectingModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(store, {initialState: get__HMR__state}),
    StoreDevtoolsModule.instrument({maxAge: 100}),
    MatChipsModule,
    MatButtonToggleModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    RepairHistoryDetailApiService,
    RepairDataPostToServerService,
    RepairHistoryQueryConnectWithServerService,
    WatchStoreChangeService,
    RepairCollectGetBaseDataFromServerService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'zh-hans'},
    {provide: SnackBarConfig, useValue: SnackBarConfigValue},
    FilterSelectedDateFromMappedListPipe,
    {provide: UseMockData, useValue: environment.mock_data}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginFormComponent,
    RepairCollectEditDataDialogComponent,
  ]
})
export class AppModule {
  constructor() {
  }
}
