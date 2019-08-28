import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginFormComponent } from './login-user-form/login-user-form.component';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';

import { UserAuthGuard } from './guards/user.auth.guard';

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
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
