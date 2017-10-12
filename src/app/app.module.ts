import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ApplicationRef, LOCALE_ID} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgZorroAntdModule} from 'ng-zorro-antd';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {
  MatChipsModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatTooltipModule,
  MatInputModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatSnackBarModule,
  MatTableModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatCardModule,
  MatSidenavModule,
  MatToolbarModule,
  MatExpansionModule,
  MatCheckboxModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Router, RouterModule, Routes} from '@angular/router';
import {store} from './store';
import {get__HMR__state} from '../hmr';
import {StoreModule} from '@ngrx/store';
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
import {MapMomentToRepairPlanAndHistoryDataPipe} from './map-moment-to-repair-plan-and-history-data.pipe';

import {RepairPlanDialogComponent} from './repair-history-collect/repair-plan-dialog/repair-plan-dialog.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'repair-history-collect', component: RepairHistoryCollectComponent, pathMatch: 'full'},
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
    RepairPlanDialogComponent,
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
  providers: [UserService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'zh-hans'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginFormComponent,
    RepairPlanDialogComponent,
  ]
})
export class AppModule {
  constructor() {
  }
}
