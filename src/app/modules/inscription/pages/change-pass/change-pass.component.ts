import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css'],
})
export class ChangePassComponent implements OnInit {

  public nombre = '';
  public userName = 0;

  ngOnInit(): void {
    const userDataString = localStorage.getItem('user');

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.userName = userData.name;
    }
  }

  public confirmForm: FormGroup = this.fb.group(
    {
      currentPass: ['', [Validators.required]],
      newPass: ['', [Validators.required]],
      repeatPass: ['', [Validators.required]],
    },
    { validator: this.matchingFieldsValidator('newPass', 'repeatPass') }
  );

  constructor(private fb: FormBuilder, private _userService: UserService) {}

  isValidField(field: string): boolean | null {
    return (
      this.confirmForm.controls[field].errors &&
      this.confirmForm.controls[field].touched
    );
  }

  matchingFieldsValidator(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value1 = control.get(field1)?.value;
      const value2 = control.get(field2)?.value;

      if (value1 !== value2) {
        return { matchingFields: true };
      }

      return null;
    };
  }

  onSave(): void {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }
  }

  /**
   * Método para borrar a un usuario PERSONAL/AUXILIARES mediante el correo
   *
   * @params Correo del usuario AUXILIAR a borrar traído de la vista
   * @return recarga la lista con el usuario AUXILIAR eliminado
   */
  public changePass() {
    const currentP = this.confirmForm.get('currentPass')?.value;
    const newP = this.confirmForm.get('newPass')?.value;
        this._userService.changePass(currentP, newP).subscribe({
          next: ok =>{
            Swal.fire({
              title: 'Contraseña cambiada correctamente',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            })
          },
          error: err =>{
            Swal.fire({
              title: 'Ha ocurrido un error',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            })
          }
        });
      }

  }


