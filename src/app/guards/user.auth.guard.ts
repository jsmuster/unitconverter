import { Router, CanActivate } from "@angular/router";
import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserAuthGuard implements CanActivate
{
  constructor(private userService: UserService, private router: Router)
  {

  }
  canActivate()
  {
    //console.log("UserAuthGuard");

    if(this.userService.isLoggedIn())
    {
      return true;
    }
    else
    {
      let path = '/';

      this.router.navigate([path]);

      return false;
    }
  }
}