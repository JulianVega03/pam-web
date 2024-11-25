import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/data/enums/rol.enum';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivateChild {

  constructor(
    private auth: AuthService,
    private router: Router
  ){ }

  canActivateChild(): boolean | Observable<boolean >  {
    const role = this.auth.getRoleUser();

    if (role == Role.USUARIO){
      this.router.navigate(['404']);
      return false
    }
    return role == Role.ADMIN || role == Role.ENCARGADO;
  }


  
}
