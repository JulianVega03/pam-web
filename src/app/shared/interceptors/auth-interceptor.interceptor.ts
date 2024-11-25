import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../../modules/auth/services/jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private jwtHelper: JwtService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(request.headers.has('Authorization')){
      return next.handle(request.clone({headers: request.headers.set('Authorization', this.jwtHelper.getToken() )}));
    }

    return next.handle(request);
  }

}
