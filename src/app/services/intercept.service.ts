import { Injectable } from '@angular/core';
import {
  HttpEvent, 
  HttpInterceptor, 
  HttpHandler, 
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';


@Injectable()
export class InterceptService  implements HttpInterceptor {

	private startsWith: string[] = ['/api/v1/user/login/', '/api/v1/user/increment/'];

	constructor()
	{

	}

	starts(url:string)
	{
		let bStarts = false;

		for(let i = 0, l = this.startsWith.length; i < l; i++)
		{
			if(url.indexOf(this.startsWith[i]) == 0)
			{
				bStarts = true;
				// console.log("URL starts with " + this.startsWith[i]);
			}
			else
			{

			}
		}

		return bStarts;
	}

	// intercept request and add token
  	intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
  		
  		let uData = localStorage.getItem("userData");
  		
  		if(uData != null)
  		{
  			let userData = null;

  			try
  			{
  				userData = JSON.parse(uData);
  			}
  			catch(e)
  			{
  				userData = null;
  			}

  			let url = request.url;

  			if(this.starts(url) == true)
  			{
  				if(userData != null)
	  			{
	  				// modify request, add Authorization token
				    request = request.clone({headers: request.headers.set('Authorization', `Bearer ${userData.token}`)});

				   	return next
						.handle(request)
						.pipe(
							tap((ev: HttpEvent<any>) => {

								if(ev instanceof HttpResponse)
								{
									// http response status code
									// console.log(ev.status);
								}
							}),
						 	catchError(response => {
								
								if(response instanceof HttpErrorResponse)
								{
									console.log('Processing http error', response);
								}

								throw Error(response);
							})
						)
	  			}
  			}
  		}
  		
  		// pass through
  		return next.handle(request);
    };
  
 
}