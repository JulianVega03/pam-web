import { Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild{


  private roleActivate = ''

  constructor(
    private auth: AuthService,
    private router: Router
  ){

   }


  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  | boolean {

    this.roleActivate = this.auth.getRoleUser();

    if( this.roleActivate == 'ADMIN' && state.url.includes('/admin') )
      return true
      
    if( this.roleActivate == 'ENCARGADO' && state.url.includes('/encargado') )
      return true

    if( this.roleActivate == 'USUARIO' && state.url.includes('/aspirante') )
      return true

    this.router.navigate(['404']);

    return false;
  }


  canActivate(): Observable<boolean>  | boolean  {

    if(!this.auth.hasActiveSession()){
      this.router.navigate(['auth/sign-in/aspirante'])
      return false
    }
    return true;
  }

}
