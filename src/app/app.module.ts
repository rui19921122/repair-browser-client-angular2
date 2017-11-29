import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FlexLayoutModule} from '@angular/flex-layout';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {AppState, store} from './store';
import {get__HMR__state} from '../hmr';
import {Store, StoreModule} from '@ngrx/store';
import {HomeComponent} from './home/home.component';
import {UserService} from './services/user.service';
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
import {MomentPipe} from './pipes/moment.pipe';
import {InTheMomentListPipe} from './pipes/in-the-moment-list.pipe';
import {GetDataByIdPipe} from './pipes/get-data-by-id.pipe';
import {SplitLongSentenceWithColon} from './pipes/split-long-sentence-with-colon.pipe';
import {MapMomentToRepairPlanAndHistoryDataPipe} from './pipes/map-moment-to-repair-plan-and-history-data.pipe';

import {RepairPlanEditDialogComponent} from './repair-history-collect/repair-plan-edit-dialog/repair-plan-dialog.component';
import {RepairHistoryDetailApiService} from './services/repair-history-detail-api.service';
import {GetChildObjectInObjectByIdPipe} from './pipes/get-child-object-in-object-by-id.pipe';
import {RepairHistoryEditDialogComponent} from './repair-history-collect/repair-history-edit-dialog/repair-history-edit-dialog.component';
import { RepairDataPostToServerService } from './services/repair-data-post-to-server.service';
import { PrettyprintPipe } from './pipes/prettyprint.pipe';
import { DiffTimeWithStringFormatPipe } from './pipes/diff-time-with-string-format.pipe';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'repair-history-collect', component: RepairHistoryCollectComponent, pathMatch: 'full'},
  {path: 'test', component: RepairHistoryDetailCardComponent, pathMatch: 'full'},
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
    RepairPlanEditDialogComponent,
    SplitLongSentenceWithColon,
    GetChildObjectInObjectByIdPipe,
    RepairHistoryEditDialogComponent,
    PrettyprintPipe,
    DiffTimeWithStringFormatPipe,
  ],
  imports: [
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
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'zh-hans'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginFormComponent,
    RepairPlanEditDialogComponent,
    RepairHistoryEditDialogComponent,
  ]
})
export class AppModule {
  constructor(public store: Store<AppState>) {
  }
}
