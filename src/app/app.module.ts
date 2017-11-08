import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgZorroAntdModule} from 'ng-zorro-antd';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
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
import {UserService} from './user.service';
import {LoginFormComponent} from './header/login-form/login-form.component';
import {HttpModule} from '@angular/http';
import {RepairHistoryCollectComponent} from './repair-history-collect/repair-history-collect.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {StoreRouterConnectingModule} from '@ngrx/router-store';

import {DateCardListComponent} from './repair-history-collect/repair-collect-date-card-list/date-card-list.component';
import {DateCardComponent} from './repair-history-collect/repair-collect-date-card/date-card.component';
import {ContentComponent} from './repair-history-collect/content/content.component';
import {RepairPlanDetailCardComponent} from './repair-history-collect/repair-plan-detail-card/repair-plan-detail-card.component';
import {RepairHistoryDetailCardComponent} from './repair-history-collect/repair-history-detail-card/repair-history-detail-card.component';
import {MomentPipe} from './moment.pipe';
import {InTheMomentListPipe} from './in-the-moment-list.pipe';
import {GetDataByIdPipe} from './get-data-by-id.pipe';
import {SplitLongSentenceWithColon} from './split-long-sentence-with-colon.pipe';
import {MapMomentToRepairPlanAndHistoryDataPipe} from './map-moment-to-repair-plan-and-history-data.pipe';

import {RepairPlanEditDialogComponent} from './repair-history-collect/repair-plan-edit-dialog/repair-plan-dialog.component';
import {RepairHistoryDetailApiService} from './services/repair-history-detail-api.service';
import {GetChildObjectInObjectByIdPipe} from './get-child-object-in-object-by-id.pipe';
import { RepairHistoryEditDialogComponent } from './repair-history-collect/repair-history-edit-dialog/repair-history-edit-dialog.component';

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
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
    MatSidenavModule,
    MatToolbarModule,
    NgZorroAntdModule.forRoot(),
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
    HttpModule,
    StoreRouterConnectingModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(store, {initialState: get__HMR__state}),
    StoreDevtoolsModule.instrument({maxAge: 100}),
    MatChipsModule,
  ],
  providers: [
    UserService,
    RepairHistoryDetailApiService,
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
