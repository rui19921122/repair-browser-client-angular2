import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ApplicationRef} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {removeNgStyles, createNewHosts, bootloader, createInputTransfer} from '@angularclass/hmr';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {
  MdButtonModule,
  MdDialogModule,
  MdInputModule,
  MdMenuModule,
  MdAutocompleteModule,
  MdProgressSpinnerModule,
  MdDatepickerModule,
  MdSnackBarModule,
  MdNativeDateModule,
  MdSidenavModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Router, RouterModule, Routes} from '@angular/router';
import {store, metaReducers} from './store';
import {StoreModule} from '@ngrx/store';
import {HomeComponent} from './home/home.component';
import {UserService} from './user.service';
import {LoginFormComponent} from './header/login-form/login-form.component';
import {HttpModule} from '@angular/http';
import {RepairHistoryCollectComponent} from './repair-history-collect/repair-history-collect.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

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
  ],
  imports: [
    FormsModule,
    MdSidenavModule,
    ReactiveFormsModule,
    BrowserModule,
    MdNativeDateModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdMenuModule,
    MdInputModule,
    MdSnackBarModule,
    MdDatepickerModule,
    MdDialogModule,
    MdAutocompleteModule,
    HttpModule,
    MdProgressSpinnerModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(store, {metaReducers: metaReducers as any}),
  ],
  providers: [UserService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginFormComponent]
})
export class AppModule {

}
