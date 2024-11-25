import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PersonalInfoComponent } from 'src/app/modules/inscription/components/personal-info/personal-info.component';
import swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanDeactivate<PersonalInfoComponent> {

  constructor( 
    private auth: AuthService,
    private router: Router
  ){}

  canDeactivate(component: PersonalInfoComponent,): Observable<boolean> | boolean {
    const status = JSON.parse(localStorage.getItem('user')!).status ||  1;
    if ( status != 1 || component.finishInscriptionTrigger ) {
      localStorage.removeItem('userInfo');
      return true;
    }
  
    return new Observable<boolean>((observer) => {
      swal
        .fire({
          title: '¡Aún no ha terminado!',
          text: `Parece ser que no has completado todos los pasos. ¿Estás seguro de que deseas finalizar la sesión?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
        })
        .then((res) => {
          if (res.dismiss || res.isDenied) {
            observer.next(false);
          } else {
            this.auth.purgeAuth();
            localStorage.setItem('userInfo', JSON.stringify(component.mainForm.value));
            observer.next(true);
          }
          observer.complete();
        });
    });
  }
  
  
}
