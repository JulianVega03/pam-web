import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/data/interfaces/user.example.interface';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { CohorteService } from '../../services/cohorte.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EvaluactionService } from '../../services/evaluacion.service';
import { Cohorte } from 'src/app/data/interfaces/cohorte.interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css'],
})
export class PruebaComponent implements OnInit {
  public minDate: Date;
  public users: User[] = [];
  public isOpenCohorte = false;
  public hideButton = false;
  public currentCohorte!: Cohorte | null;

  public pruebaForm: FormGroup = this._fb.group({
    enlace: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$'
        ),
      ],
    ],
    fecha: ['', [Validators.required]],
  });

  public puntajePruebaForm: FormGroup = this._fb.group(
    {
      puntaje: ['', [Validators.required]],
    },
    { validator: this.matchingFieldsValidator('puntaje') }
  );

  constructor(
    private _userService: UserService,
    private cohorteS: CohorteService,
    private _fb: FormBuilder,
    private _evalService: EvaluactionService,
    private _ngxSpinner: NgxSpinnerService
  ) {
    this.minDate = new Date();
  }
  /**
   * Método para validar los inputs que no queden vacíos
   *
   * @params Input a validar y el tipo para identificar el formulario
   * @return
   */
  isValidField(field: string, type: number): boolean | null {
    if (type == 1) {
      return (
        this.pruebaForm.controls[field].errors &&
        this.pruebaForm.controls[field].touched
      );
    } else {
      if (type == 2) {
        return (
          this.puntajePruebaForm.controls[field].errors &&
          this.puntajePruebaForm.controls[field].touched
        );
      }
      return null;
    }
  }
  /**
   * Método para validar que el puntaje no sea mayor a 40
   *
   * @params Input a validar
   * @return
   */
  matchingFieldsValidator(field1: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value1 = control.get(field1)?.value;
      if (value1 > 40) {
        return { mayor40: true };
      }
      return null;
    };
  }
  /**
   * Método para activar el botón siempre y cuando no hayan errores en los inputs del formulario
   *
   * @params
   * @return
   */
  onSave(): void {
    if (this.pruebaForm.invalid) {
      this.pruebaForm.markAllAsTouched();
      return;
    }
    if (this.puntajePruebaForm.invalid) {
      this.puntajePruebaForm.markAllAsTouched();
      return;
    }
  }

  ngOnInit(): void {
    this.cohorteS.currentCohorte.subscribe({
      next: (res) => {
        if (res != null) this.isOpenCohorte = true;
      },
    });
    this.getUsers();
    this.cohorteS.openCohorte().subscribe({
      next: (res) => {
        if (res != null) this.currentCohorte = res;
        if (this.currentCohorte?.enlace_prueba != '' && this.currentCohorte?.fechaMaxPrueba != null) {
          this.hideButton = true;
          this.pruebaForm.get('enlace')?.setValue(this.currentCohorte?.enlace_prueba);
          this.pruebaForm.get('fecha')?.setValue(new Date(this.currentCohorte?.fechaMaxPrueba));
          }else{
            this.hideButton = false;
          }
      },
    });
  }


  /**
   * Método para listar a todos los usuarios ASPIRANTE listos para entrevista y prueba
   *
   * @params
   * @return Lista con todos los usuarios ASPIRANTE listos para entrevista y prueba
   */
  getUsers(): void {
    this._userService.listUsersfilter().subscribe((users) => {
      this.users = [...users];
    });
  }

  /**
   * Método para enviar el enlace de la prueba a los aspirantes
   *
   * @params enlace de la prueba traido del formulario
   * @return
   */
  public sendLink() {
    const fechaHoraPrueba = new Date(this.pruebaForm.controls['fecha'].value);
    fechaHoraPrueba.setHours(fechaHoraPrueba.getHours() - 5);
    const formattedFechaHoraPrueba = fechaHoraPrueba.toISOString();
    const link = this.pruebaForm.get('enlace')?.value;
    this._ngxSpinner.show();
    this._evalService.linkPrueba(link, formattedFechaHoraPrueba).subscribe({
      next: (ok) => {
        this.hideButton = true;
        this._ngxSpinner.hide();
        Swal.fire({
          title: 'Enlace enviado correctamente',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }



  /**
   * Método para enviar el puntaje de la prueba a los aspirantes
   *
   * @params id del aspirante y el puntaje del formulario
   * @return
   */
  public sendPuntaje(id: number) {
    const puntaje = this.puntajePruebaForm.get('puntaje')?.value;
    this._evalService.punjatePrueba(id, puntaje).subscribe({
      next: (ok) => {
        Swal.fire({
          title: 'Puntaje enviado correctamente',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
}
