import { R3SelectorScopeMode } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import { PersonalService } from '../../services/personal.service';
import { Personal } from 'src/app/modules/auth/interfaces/user';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  users: Personal[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  public filteredUser: Personal[] = [];

  public triggerModal = false;

  public nameUserByFilter = '';

  public registerForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public controlEditOrCreateUser = 0;

  constructor(
    private _fb: FormBuilder,
    private _personalService: PersonalService,
    private _router: Router
  ) {}

  /**
   * Método para listar a todos los usuarios PERSONAL/AUXILIARES que trae el servicio
   *
   * @params
   * @return un listado con los usuarios PERSONAL/AUXILIARES
   */
  getUsers(): void {
    this._personalService.listPersonals().subscribe((users) => {
      this.users = [...users];
      this.filteredUser = [...users];
    });
  }

  /**
   * Método para borrar a un usuario PERSONAL/AUXILIARES mediante el correo
   *
   * @params Correo del usuario AUXILIAR a borrar traído de la vista
   * @return recarga la lista con el usuario AUXILIAR eliminado
   */
  public deleteAttendant(email: string) {
    // Mini modal de confirmacion
    Swal.fire({
      title: '¿Estás seguro de que desea eliminar al usuario seleccionado?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._personalService.deletePersonals(email).subscribe((users) => {
          // Una vez borrado recargamos la lista
          this.getUsers();
        });
      }
    });
  }

  /**
   * Método para registar a un usuario PERSONAL/AUXILIARES mediante el correo
   *
   * @params Correo y contraseña del usuario AUXILIAR a registrar traído de la vista
   * @return recarga la lista con el usuario AUXILIAR registrado
   */
  public saveUser() {
    // Traemos los parámetros de la vista
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    // Mini modal de confirmación de creación
    Swal.fire({
      title: `¿Estás seguro de que desea crear al usuario?`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agregar',
    }).then((result) => {
      if (result.isDenied || result.isDismissed) return;
      // Mandamos los parámetros al back para registrar encargado
      this._personalService.register(email, password).subscribe({
        next: (res: unknown) => {
          this.getUsers();
          swal('¡Felicidades!', '¡Te has registrado con éxito!', 'success');
        },
        error: (err: unknown) => {
          swal('¡Error!', 'Correo ya registrado anteriormente', 'error');
        },
      });
      // Una vez registrado cerramos el modal
      this.triggerModal = false;

      const currentUrl = this._router.url;
      const navigationExtras: NavigationExtras = {
        skipLocationChange: true,
      };
      this._router.navigateByUrl('/', navigationExtras).then(() => {
        this._router.navigate([currentUrl], navigationExtras);
      });
    });
  }

  /**
   * Método para buscar a un usuario PERSONAL/AUXILIARES
   *
   * @params Correo del usuario AUXILIAR a buscar
   * @return El usuario AUXILIAR solicitado
   */
  public findUser() {
    // El buscador para ubicar por el email
    this.filteredUser = this.users.filter((user) =>
      user.email.toUpperCase().includes(this.nameUserByFilter.toUpperCase())
    );
  }
}
