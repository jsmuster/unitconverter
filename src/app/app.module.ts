import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserLoginFormComponent } from './login-user-form/login-user-form.component';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';

import { Routes, Router, RouterModule, CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UserService } from './services/user.service';
import { InterceptService} from './services/intercept.service';

import { UserAuthGuard } from './guards/user.auth.guard';

// import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppRoutingModule } from './app-routing.module';

/* route configuration */
const routes: Routes = [
  {
    path: '',
    component: UserLoginFormComponent
  },
  {
    path: 'user/:uid',
    component: UserHomePageComponent
    // canActivate: [UserAuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UserLoginFormComponent,
    UserHomePageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [UserService, UserAuthGuard, InterceptService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
