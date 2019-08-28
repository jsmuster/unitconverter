import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserInfoModel } from '../models/userInfo';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.css']
})

export class UserHomePageComponent implements OnInit
{
	private user: UserInfoModel = new UserInfoModel();


  private subscriber: any;
  private user_name:string;
  private user_type: string;

  dataTable: Array<any> = [];
  rotateAnimtaion: boolean = false;

	constructor(private http: HttpClient, private userService:UserService, private route: ActivatedRoute, private router:Router) {

		this.subscriber = this.route.params.subscribe((params: any) => {
      this.user_name = params.uid;
      this.getUserData();
    });


		this.userService.userData.subscribe((user)=> {
			this.user.token = user.token;
			this.user.user_name = user.user_name;
			this.user_type = user.user_type
		});

		this.getUserData();
	}

	ngOnInit() {
    this.getDataTable()   
	}

	getUserData()
	{
		this.userService.loadUser((success, userData) => {
			if(success)
			{
				this.user.user_name = userData.user_name;
				this.user.user_type = userData.user_type;
				this.user_type = userData.user_type;

			}
			else
			{
				// go back to login page
				let path = '/';

				this.router.navigate([path]);
			}
		});
	}

  getDataTable() {
  	this.rotateAnimtaion = true;
  	
    this.userService.getDataTable(dataTable => {
      this.dataTable = dataTable.rows;
      this.rotateAnimtaion = false;
    });
  }

  remove(id: any) {
    this.userService.removeRow(id, id => {
      this.dataTable.splice(id, 1);
    });
  }

  add() {
    this.userService.addRow(newDataTable => {
      this.dataTable = newDataTable.rows;
    });
  }

  changeValue(id: number, property: string, event: any, type: string = null) {
    let value = event.target.value;
    this.userService.changeDataTableRow(id, property, value, (id, row) => {
      this.dataTable[id] = row;
    });
  }

}
