import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const proxyReq = req.clone({
      url: `http://checkinappfunctions.azurewebsites.net/${req.url}`,
    });
    console.log(proxyReq);
    return next.handle(proxyReq);
  }
}
