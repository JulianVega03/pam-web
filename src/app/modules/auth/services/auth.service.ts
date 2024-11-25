/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RegisteredUser, User } from '../interfaces/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;

  public userEmail = '';

  public userToken = '';

  private currentUserSubject = new BehaviorSubject<any | null>(null);

  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private _router: Router,
    private readonly jwtService: JwtService
  ) {
    this.userToken = this.jwtService.getToken();
    if (this.userToken != undefined) {
      this.currentUserSubject.next(JSON.parse(localStorage.getItem('user')!));
    }
  }

  /**
   * Método para logearse
   * @param email  email de la cuenta a logear
   * @param password  contraseña asociada a la cuenta
   * @returns la información del usuario
   */
  public login(
    email: string,
    password: string
  ): Observable<HttpResponse<User>> {
    const observeResponse: 'body' | 'events' | 'response' = 'response';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: observeResponse,
    };

    return this.http
      .post<User>(
        `${environment.apiBaseUrl}/login`,
        { email, password },
        httpOptions
      )
      .pipe(
        tap((response) => {
          this.jwtService.saveToken(response.headers.get('Authorization')!);

          const authToken = response.headers.get('Authorization')!.split(' ')[1];
          const decodedToken = this.jwtService.unDecodeAllToken();

          this.userEmail = decodedToken.sub;
          this.userToken = authToken;

          // Se valida cambia el estado de validacion de sesion
          this.isAuthenticated = true;

          this.emitCurrentUser(this.jwtService.getRole());
        })
      );
  }

  public getRoleUser(){
    return this.jwtService.getRole();
  }

  /**
   * Método para cerrar sesion del usuario.
   */
  public logout() {
    this.purgeAuth();
    this._router.navigate(['/auth/sign-in/aspirante']);
  }

  /**
   *
   * TODO: por documentar este método.
   * @returns
   */
  public getUser(): Observable<User> {
    const url = `${environment.apiBaseUrl}/users`;
    return this.http.get<User>(url);
  }

  /**
   *
   * TODO: por documentar este método.
   * @param email
   * @param password
   * @returns
   */
  public register(email: string, password: string): Observable<RegisteredUser> {
    const url = `${environment.apiBaseUrl}/users`;
    return this.http.post<RegisteredUser>(url, {
      email,
      password,
    });
  }

  /**
   *Método para recuperar contraseña mediante el endpoint del backend
   *
   * @param email del usuario ASPIRANTE registrado
   * @returns
   */
  public recoverPass(email: string): Observable<RegisteredUser> {
    const url = `${environment.apiBaseUrl}/users/reestablecer/email?email=${email}`;
    return this.http.post<RegisteredUser>(url, {
      email,
    });
  }

  /**
   *
   * TODO: Por documentar ese método
   * @param user
   * @returns
   */
  public update(user: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(environment.apiBaseUrl, { user }).pipe(
      tap(({ user }) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Método para destruir el token del usuario
   */
  public purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

  /**
   * Método para saber si se tiene una sesion activa
   * TODO: por implemtnar logica de validacion del tiempo de expiracion del token para cerrar la sesion automaticamente.
   * @returns true si ya se ha autentificado el usuario
   */
  public hasActiveSession() {
    return this.isAuthenticated || this.jwtService.getToken() != null;
  }

  /**
   * Método para saber si un usuario es admin, usuario con aspirante
   * TODO: por implementar la logica cuando sea encargado.
   * @param id del usuario
   * @returns observable con toda la informacion del usuario
   */
  private getUserInfo() {
    const headers = new HttpHeaders({
      Authorization: ''
    })
    return this.http.get(`${environment.apiBaseUrl}/aspirante/obtener`, {headers});
  }

  /**
   * Método para la emision del usuario dependiendo del role
   * @param id correspondiente al usuario
   * @param role role correspondiente al usuario
   * @returns
   */

  private emitCurrentUser( role: string) {
    if (role == 'USUARIO') {
      this.getUserInfo().subscribe({
        next: ({ nombre, apellido, estado, id }: any) => {
          this.currentUserSubject.next({
            name: `${nombre} ${apellido}`,
            status: estado.id,
            role,
            id,
          });
          localStorage.setItem(
            'user',
            JSON.stringify(this.currentUserSubject.getValue())
          );
        },
        error: (res) => {
          this.currentUserSubject.next({
            status: 1,
            role,
          });
          localStorage.setItem(
            'user',
            JSON.stringify(this.currentUserSubject.getValue())
          );
        },
      });
      return;
    }

      //TODO: Mejorar estas lineas de código, ya que hacen lo mismo.
    if (role == 'ENCARGADO') {
      this.currentUserSubject.next({
        name: 'Encargado',
        role: this.jwtService.getRole(),
        status: 0,
      });
      localStorage.setItem(
        'user',
        JSON.stringify(this.currentUserSubject.getValue())
      );
    }

    // emito el valor para el guard
    if (role == 'ADMIN') {
    this.currentUserSubject.next({
      name: 'Administrador',
      role: this.jwtService.getRole(),
      status: -1,
    });
    localStorage.setItem(
      'user',
      JSON.stringify(this.currentUserSubject.getValue())
    );
  }}

  public changeStateCurrentUser(){
    this.emitCurrentUser(this.jwtService.getRole());
  }
}
