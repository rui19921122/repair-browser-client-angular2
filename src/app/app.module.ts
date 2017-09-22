import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ApplicationRef, LOCALE_ID} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgZorroAntdModule} from 'ng-zorro-antd';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {
  MdButtonModule,
  MdDialogModule,
  MdTooltipModule,
  MdInputModule,
  MdMenuModule,
  MdAutocompleteModule,
  MdProgressSpinnerModule,
  MdDatepickerModule,
  MdSnackBarModule,
  MdTableModule,
  MdNativeDateModule,
  MdProgressBarModule,
  MdCardModule,
  MdSidenavModule,
  MdToolbarModule,
  MdExpansionModule
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
import { MomentPipe } from './moment.pipe';
import { InTheMomentListPipe } from './in-the-moment-list.pipe';
import { GetDataByIdPipe } from './get-data-by-id.pipe';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'repair-history-collect', component: RepairHistoryCollectComponent, pathMatch: 'full'}
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
  ],
  imports: [
    FormsModule,
    MdTooltipModule,
    MdSidenavModule,
    ReactiveFormsModule,
    MdToolbarModule,
    NgZorroAntdModule.forRoot(),
    MdProgressBarModule,
    MdTableModule,
    BrowserModule,
    MdCardModule,
    MdNativeDateModule,
    FlexLayoutModule,
    MdExpansionModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdMenuModule,
    MdInputModule,
    MdSnackBarModule,
    MdDatepickerModule,
    MdDialogModule,
    MdAutocompleteModule,
    HttpModule,
    StoreRouterConnectingModule,
    MdProgressSpinnerModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(store, {initialState: get__HMR__state}),
    StoreDevtoolsModule.instrument({maxAge: 100}),
  ],
  providers: [UserService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'zh-hans'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginFormComponent]
})
export class AppModule {
  constructor() {
  }
}
