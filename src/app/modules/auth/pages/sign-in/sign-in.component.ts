/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { MatDialog } from '@angular/material/dialog';
import { RecoveryPassComponent } from '../recovery-pass/recovery-pass.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CohorteService } from 'src/app/modules/inscription/services/cohorte.service';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {

  public mainForm: FormGroup;
  public dissabledLogin = false;

  constructor(
    private _router: Router,
    public dialog: MatDialog,
    private _authService: AuthService,
    private _fb: FormBuilder,
    private jwlHelper: JwtService,
    private spinner: NgxSpinnerService,
    // private _cohorteService: CohorteService,
    private _applicantService: ApplicantService
  ) {
    this.mainForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public userLogin() {
    const email = this.mainForm.get('email')?.value;
    const password = this.mainForm.get('password')?.value;
    this.spinner.show();
    this.dissabledLogin = true; //con esta variable bloqueamos los botones de crear cuenta y recuperar contraseña cuando se marque el iniciar sesion.

    if(this.mainForm.controls['email'].invalid ){
      this.mainForm.markAllAsTouched()
      return;
    }

    this._authService.login(email, password).subscribe({
      next: ( res: any) => {
        const role = this.jwlHelper.getRole();
        this.spinner.hide();
        this._router.navigateByUrl(this.getNavigateUrl(role))
      },

      error: (err: any) => {
        this.spinner.hide();
        this.dissabledLogin = false;
        console.log(err)
        swal.fire({
          title: `${err.error.error}`,
          text : `${err.error.message}`,
          icon: 'error',
          confirmButtonColor: '#007f5f',
          confirmButtonText: 'Confirmar',
        });
      },
    });
  }

  public openSignUpDialog(): void {
    const dialogRef = this.dialog.open(SignUpComponent);

    dialogRef.afterClosed().subscribe((result) => {});
  }
  public openRecoverPassDialog(): void {
    const dialogRef = this.dialog.open(RecoveryPassComponent);

    dialogRef.afterClosed().subscribe((result) => {});
  }

  /**
   * Método para retornar la url de navegacion dado el rol.
   * @param role role del usuario
   * @returns la url a navegar
   */
  public getNavigateUrl(role: string) {
    const urls: { [key: string]: string } = {
      USUARIO: '/inscription/aspirante',
      ADMIN: '/inscription/backlog/home',
      ENCARGADO: '/inscription/backlog/home',
    };

    return urls[role];
  }

  redirectToCreditos() {
    window.location.href = '../../../assets/creditos.html';
  }
}
