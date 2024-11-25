import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.css']
})
export class RecoveryPassComponent {

  public recoverForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private dialogRef: MatDialogRef<RecoveryPassComponent>,
    private _fb: FormBuilder,
    private _authService : AuthService,
    ) { }

  //Recuperar contraseña modal y llamado al servicio
  public recoverPass(){
    // Traemos los parámetros de la vista
    const email = this.recoverForm.get('email')?.value;
    //llamado al servicio
    this._authService.recoverPass(email).subscribe({
     next: (res: unknown) => {
      this.dialogRef.close();
      swal('¡Revisa tu email!', 'La contraseña nueva fue enviada para que puedas iniciar sesión', 'success');
    },
   error: (err: unknown) => {
      swal('¡Error!', 'Correo no registrado', 'error');
    }
  })
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
