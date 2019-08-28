import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from './services/user.service';
import { UserInfoModel } from './models/userInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent
{
	title = 'Incrementor';

	constructor(private http: HttpClient, private userService:UserService) {}

  	ngOnInit() {  	}

  	logOut() {
  		this.userService.logOut();
  	}
}
