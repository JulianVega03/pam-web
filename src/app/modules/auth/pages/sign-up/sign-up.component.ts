import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  public mainForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private dialogRef: MatDialogRef<SignUpComponent>,
    private spinner: NgxSpinnerService
  ) {
    this.mainForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
  }

  public register() {
    const email = this.mainForm.get('email')?.value;
    const password = this.mainForm.get('password')?.value;
    const password_confirmation = this.mainForm.get('password_confirmation')?.value;

    // Si las contraseñas son diferentes, se marca el error y se no se ejecuta nada del código siguiente
    if (password !== password_confirmation){
      swal('¡Error!', 'Contraseñas diferentes, ingresalas de nuevo', 'error');
      return
    }

    if (password.length < 8 || password_confirmation.length < 8){
      swal('¡Error!', 'Contraseña menor a 8 caracteres, ingresalas de nuevo', 'error');
      return
    }

    //disparamos la pantalla de espera.
    this.spinner.show();

    //hacemos el llamado a la API
    this._authService.register(email, password).subscribe({

      next: res => {
        swal('¡Felicidades!', '¡Te has registrado con éxito!', 'success');
        this.dialogRef.close();
        this.spinner.hide();
      },

      error: err => {
        this.spinner.hide();
        console.log(err);
        swal('¡Error!', err, 'error');
      },
    });

  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
