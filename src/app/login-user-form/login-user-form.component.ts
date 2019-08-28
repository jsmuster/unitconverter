import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from "@angular/router";



@Component({
  selector: 'login-user-form.component',
  templateUrl: './login-user-form.component.html',
  styleUrls: ['./login-user-form.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class UserLoginFormComponent implements OnInit {
	registered = false;
	submitted = false;
	loginForm: FormGroup;
	guid: string;
	serviceErrors:any = {};

  constructor(private formBuilder: FormBuilder, private userService:UserService, private router: Router)
  {
    this.serviceErrors = {};

  	// this.http.get('/api/v1/generate_uid').subscribe((data:any) => {
   //    this.guid = data.guid;
   //  }, error => {
   //      console.log("There was an error generating the proper GUID on the server", error);
   //  });
  }

  invalidLogin()
  {
  	return (this.submitted && (this.serviceErrors.user_name != null || this.loginForm.controls.user_name.errors != null));
  }

  invalidPassword()
  {
  	return (this.submitted && (this.serviceErrors.password != null || this.loginForm.controls.password.errors != null));
  }

  ngOnInit()
  { 
    this.userService.logOut();
  	this.loginForm = this.formBuilder.group({
  		user_name: ['', [Validators.required, Validators.maxLength(50)]],
  		password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
  	});
  }

  onSubmit()
  {
  	this.submitted = true;

  	if(this.loginForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{
		  let data: any = Object.assign({}, this.loginForm.value);

      this.userService.login(data, (success, user) => {
        
        if(success == true)
        {
          let path = '/user/' + user.user_name;

          this.router.navigate([path]);

          this.userService.setUserData(user);
        }
        else
        {
          this.serviceErrors.password = "Invalid login";
        }

      });

      

  		this.registered = true;
  	}
  }

};