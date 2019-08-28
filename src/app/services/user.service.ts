import { UserInfoModel } from '../models/userInfo';
import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class UserService
{
	private jwtHelper: JwtHelperService;

	private bIsLoggedIn: boolean = false;
	private user: UserInfoModel = new UserInfoModel();

	private userDataSrc = new Rx.Subject<any>();
	private incrementDataSrc = new Rx.Subject<any>();

	userData = this.userDataSrc.asObservable();
	incrementData = this.incrementDataSrc.asObservable();

	constructor(private http: HttpClient)
	{
		this.jwtHelper = new JwtHelperService();

		let userData = JSON.parse(localStorage.getItem("userData"));

		/* retrieve user data from local storage if token isn't expired */
		if(userData != null && userData.user_name != null && userData.token != null && this.jwtHelper.isTokenExpired(userData.token) != true)
		{
			this.user.user_name = userData.user_name;
			this.user.user_type = userData.user_type;


			this.bIsLoggedIn = true;
		}
	}

	setUserData(data: any)
	{	
		this.user.user_name = data.user_name;
		this.user.user_type = data.user_type;

		// this.user.token = data.token;

		this.userDataSrc.next(this.user);
	}

	getUser()
	{
		return this.user;
	}

	isLoggedIn()
	{
		return this.bIsLoggedIn;
	}

	login(loginData: any, cb:any)
	{
		this.http.post('/api/v1/user/login', loginData).subscribe((data:any) => {
		    if(data.success == true)
		    {
				/* initial user data that comes from server */
				this.setUserData(data.user);

				/* execute a post */
				if(cb != null)
		      	{
		      		cb(true, data.user);
		      	}

		      	/* set user data into a local cookie */
		      	localStorage.setItem("userData", JSON.stringify(data.user));

		      	//const token = localStorage.getItem('token');

		      	/* set the service as logged in */
		      	this.bIsLoggedIn = true;
			}

		}, (error) =>
		{
		    if(error != null && error.status != null && error.status != 404)
		    {
		    	if(error.error != null && error.error.error != null)
		    	{
		    		cb(false, error.error.error);
		    	}
		    	else
		    	{
		    		cb(false, error);
		    	}
		    }

		});
	}

	loadUser(cb: any)
	{
		let user: UserInfoModel = this.user;

		if(user != null && user.user_name != null)
		{
			this.http.get('/api/v1/user/login/' + user.user_name).subscribe((data:any) => {

	       		if(data != null && data.user != null && data.user.user_name != null)
				{
					if(user.user_name == data.user.user_name)
					{
						if(cb != null)
						{	
							cb(true, data);
						}
					}

					this.setUserData(data.user);
				}
				else
				{
					console.error("There was an error at loading '/api/v1/user/" + user.user_name + "'");
					// throw {
					//     name: "ValidationError",
					//     message: "There was an error at loading '/api/v1/user/" + user.user_name + "'"
					// };
				}
		    });
		}
		else
		{
			cb(false, user.user_name);
		}
	}

  logOut() {
  	localStorage.removeItem("userData");
  	this.bIsLoggedIn = false;
  }  



  getDataTable(callBack: any) {
  	this.http.get('/api/v1/user/getTable').subscribe((dataTable) => {
  		callBack(dataTable);
  	}, (error) => {alert('Opps, something went wrong: ' + error.statusText)});
  }

  changeDataTableRow(id, property, value, callBack) {
  	this.http.post('/api/v1/user/changeRow', {id, property, value}).subscribe((response: any) => {
  		if(response.success === true && callBack != null) callBack(response.id, response.row);
  	}, (error) => {alert('Opps, something went wrong: ' + error.statusText)});
  }

  removeRow(id: number, callBack: any = null) {
  	this.http.post('/api/v1/user/deleteRow', {id}).subscribe((data: any) => {
  		if(data.success === true && callBack != null) callBack(data.id);
  	}, (error) => {alert('Opps, something went wrong: ' + error.statusText)});
  }
  addRow(callBack: any) {
  	this.http.get('/api/v1/user/addRow').subscribe((response: any) => {
  		if(response.success === true && callBack != null) callBack(response.newDataTable);
  	}, (error) => {alert('Opps, something went wrong: ' + error.statusText)});
  }

}
