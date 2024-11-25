import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
})
export class StepperComponent implements OnInit {

  public selectedStepIndex!: number;
  public steps  = [
    'personal-info',
    'documents',
    'status',
  ];

  public pasos: MenuItem[] = [
    {
      label: 'Información Personal',
      routerLink: 'personal-info',
      styleClass:'text-red-500'
    },
    {
      label: 'Documentos',
      routerLink: 'documents',
      styleClass:'text-red-500'
    }
  ];

  constructor(
    private readonly router: Router, 
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.currentUser.subscribe({
      next: (user) => {
        if(user != null){

          if((user.status > 4 && user.status < 7) && this.pasos.length == 2){
            this.pasos.push( {
              label: 'Pruebas',
              routerLink: 'status',
              styleClass:'text-red-500'
            },)
          }

          this.selectedStepIndex =  this.validateState(user?.status);
          this.router.navigate([`/inscription/aspirante/${this.steps[this.selectedStepIndex]}`]);
        }
      },
    });
  }

  /**
   * Método para validar el estado del aspirante y controlar el stepper
   * @param status estado actual del aspirante
   * @returns el indece para navegación en el stepper
   */
  private validateState( status: number ){
    if(status >= 2 && status <= 4)
      return 1
    
    if(status >= 5)
      return 2
    
    return 0
  }
}
