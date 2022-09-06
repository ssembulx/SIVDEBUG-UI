import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { error } from 'selenium-webdriver';
import { Inject } from '@angular/core';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(@Inject(Router) private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true
    });
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (event.status === 200) {
            if (!body.isSuccess && body.message) {
           //   this.router.navigate(['error'], { queryParams: { message: body.message } });
            }
          }
        }
      })
    );
  }
}
