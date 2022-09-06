import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  handleError(error) {
  //  this.router.navigate(['error'], { queryParams: { message: error.statusText } });
  }
  constructor(@Inject(Router) private router: Router) { }
}
