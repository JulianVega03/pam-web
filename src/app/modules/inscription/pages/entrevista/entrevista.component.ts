import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/data/interfaces/user.example.interface';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { CohorteService } from '../../services/cohorte.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EvaluactionService } from '../../services/evaluacion.service';
import { HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/modules/auth/services/jwt.service';
import { Cohorte } from 'src/app/data/interfaces/cohorte.interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-entrevista',
  templateUrl: './entrevista.component.html',
  styleUrls: ['./entrevista.component.css'],
})
export class EntrevistaComponent implements OnInit {
  public hideButton = false;
  public minDate: Date;
  public users: User[] = [];
  public userForms!: FormArray;
  public puntajeEntrevistaForms!: FormArray;
  public isOpenCohorte = false;
  public message = '';
  public availableRooms: string[] = [];
  public currentCohorte!: Cohorte | null;
  public entrevistaForm: FormGroup = this._fb.group({
    enlace: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$'
        ),
      ],
    ],
    enlace2: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$'
        ),
      ],
    ],
    enlace3: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$'
        ),
      ],
    ],
  });
  public fechaEntrevistaForm: FormGroup = this._fb.group({
    fechaEntr: ['', [Validators.required]],
  });
  
  @ViewChild('algo') algo: ElementRef<any>;

  constructor(
    private _userService: UserService,
    private cohorteS: CohorteService,
    private _fb: FormBuilder,
    private _evalService: EvaluactionService,
    private jwt: JwtService,
    private http: HttpClient,
    private _ngxSpinner: NgxSpinnerService
  ) {
    // Fecha mínima a mostrar desde hoy
    this.minDate = new Date();

    this.algo = new ElementRef<any>(null);

    this.userForms = this._fb.array([]);
    this.puntajeEntrevistaForms = this._fb.array([]);
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
        this.entrevistaForm.controls[field].errors &&
        this.entrevistaForm.controls[field].touched
      );
    } else {
      if (type == 2) {
        return (
          this.fechaEntrevistaForm.controls[field].errors &&
          this.fechaEntrevistaForm.controls[field].touched
        );
      } 
      return null;
    }
  }

  isValidFieldGroup(controlName: string, userIndex: number): boolean {
    const control = this.getUserFormGroup(userIndex).get(controlName);
    return control?.invalid && (control?.dirty || control?.touched) || false;
  }

  isValidFieldPuntaje(controlName: string, userIndex: number): boolean {
    const control = this.getPuntajeEntrevistaForms(userIndex).get(controlName);
    return control?.invalid && (control?.dirty || control?.touched) || false;
  }

  getUserFormGroup(index: number): FormGroup {
    return this.userForms.at(index) as FormGroup;
  }

  getPuntajeEntrevistaForms(index: number): FormGroup {
    return this.puntajeEntrevistaForms.at(index) as FormGroup;
  }

  /**
   * Método para validar que el puntaje no sea mayor a 15
   *
   * @params Input a validar
   * @return
   */
  matchingFieldsValidator(field1: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value1 = control.get(field1)?.value;
      if (value1 > 15) {
        return { mayor15: true };
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
    if (this.entrevistaForm.invalid) {
      this.entrevistaForm.markAllAsTouched();
      return;
    }
    if (this.fechaEntrevistaForm.invalid) {
      this.fechaEntrevistaForm.markAllAsTouched();
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
        if (this.currentCohorte?.enlace_entrevista != '') {
          this.hideButton = !this.hideButton;
          this.entrevistaForm.get('enlace')?.setValue(this.currentCohorte?.enlace_entrevista);
          this.entrevistaForm.get('enlace2')?.setValue(this.currentCohorte?.enlace_entrevista2);
          this.entrevistaForm.get('enlace3')?.setValue(this.currentCohorte?.enlace_entrevista3);
        } else {
          this.message = 'No hay enlace de entrevista establecida';
        }
        this.updateAvailableRooms();
      },
    });
  }

  updateAvailableRooms(): void {
    // Reiniciar el array de salas disponibles
    this.availableRooms = [];
    
    // Añadir las salas que tengan enlaces válidos
    if (this.entrevistaForm.get('enlace')?.getRawValue()) this.availableRooms.push('1');
    if (this.entrevistaForm.get('enlace2')?.getRawValue()) this.availableRooms.push('2');
    if (this.entrevistaForm.get('enlace3')?.getRawValue()) this.availableRooms.push('3');
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
      this.userForms = this._fb.array(
        this.users.map((user: User) =>
          this._fb.group({
            sala: [user.sala_entrevista || '', Validators.required],
            fechaEntr: [user.fecha_entrevista ? new Date(user.fecha_entrevista).toISOString().slice(0, 16) : '', Validators.required],
          })
        )
      );
      this.puntajeEntrevistaForms = this._fb.array(
        this.users.map((user: User) =>
          this._fb.group({
            puntaje: [user.puntaje_entrevista || '', Validators.required],
          }, { validator: this.matchingFieldsValidator('puntaje') })
        )
      );
      this.updateAvailableRooms();
    });
  }

  /**
   * Método para enviar el enlace de la entrevista a los aspirantes
   *
   * @params enlace de la entrevista traido del formulario
   * @return
   */
  public sendLink(sala: string = "") {
    const link = this.entrevistaForm.get(`enlace${sala}`)?.value;
    this._ngxSpinner.show();
    this._evalService.linkEntrevt(link, sala).subscribe({
      next: (ok) => {
        this.hideButton = true;
        this._ngxSpinner.hide();
        this.message = `Enlace de entrevista sala ${sala}: ${link}`;
        Swal.fire({
          title: 'Enlace enviado correctamente',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
        this.updateAvailableRooms();
      },
    });
  }

  /**
   * Método para enviar la fecha de la entrevista a los aspirantes
   *
   * @params id del aspirante y la fecha del formulario
   * @return
   */
  public sendDate(id: number, index: number) {
    const userForm = this.userForms.at(index) as FormGroup;
    const fechaHoraPrueba = new Date(userForm.controls['fechaEntr'].value);
    const sala = userForm.controls['sala'].value;
    fechaHoraPrueba.setHours(fechaHoraPrueba.getHours() - 5);
    const fechaFormateada = fechaHoraPrueba
      .toISOString()
      .slice(0, 19)
      .replace('.', ' ');
    this._evalService.fechaEntrevt(id, fechaFormateada, sala).subscribe();
    Swal.fire({
      title: 'Fecha enviada correctamente',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }

  /**
   * Método para enviar el puntaje de la entrevista a los aspirantes
   *
   * @params id del aspirante y el puntaje del formulario
   * @return
   */
  public sendPuntaje(id: number, index: number) {
    const form = this.puntajeEntrevistaForms.at(index) as FormGroup;
    const puntaje = form.controls['puntaje'].value;
    this._evalService.punjateEntrevista(id, puntaje).subscribe({
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
