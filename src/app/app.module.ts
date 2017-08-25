import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

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
import {HomeComponent} from './home/home.component';
import {UserService} from './user.service';
import {LoginFormComponent} from './header/login-form/login-form.component';
import {HttpModule} from '@angular/http';
import {RepairHistoryCollectComponent} from './repair-history-collect/repair-history-collect.component';

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
    MdSidenavModule,
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
    RouterModule.forRoot(routes)
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
  entryComponents: [LoginFormComponent]
})
export class AppModule {
}
