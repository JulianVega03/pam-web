import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/data/interfaces/user.example.interface';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../auth/services/jwt.service';
import { RegisteredUser } from '../../auth/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.jwt.getToken(),
    }),
  };

  constructor(private http: HttpClient, private jwt: JwtService) {}

  /**
   * Método para listar a todos los usuarios mediante el endpoint del backend
   * Solo está permitido para el rol de administrador.
   *
   * @params httpOptions con la autorizacion de admin
   * @return un listado con los usuarios
   */
  public listUsers(id = -1): Observable<User[]> {

    const url = id != -1 ? `${environment.apiBaseUrl}/aspirante/listar?filtro=${id}` : `${environment.apiBaseUrl}/aspirante/listar`;

    return this.http.get<any>(url, this.httpOptions);
  }
  /**
   * Método para listar a solo un usuario por su id mediante el endpoint del backend
   * Solo está permitido para el rol de administrador.
   *
   * @params el id del usuario y httpOptions con la autorizacion de admin
   * @return un listado con los usuarios
   */
  public getUser(id: number): Observable<User> {
    return this.http.get(`${environment.apiBaseUrl}/aspirante?id=${id}`,this.httpOptions);
  }

  /**
   * Método para listar a los usuarios ASPIRANTE que estén listos para presentar prueba y entrevista mediante el endpoint del backend
   * Solo está permitido para el rol de administrador.
   *
   * @params httpOptions con la autorizacion de
   * @return un listado con los usuarios
   */
  public listUsersfilter(): Observable<User[]> {
    return this.http.get<any>(`${environment.apiBaseUrl}/aspirante/listar?filtro=5`, this.httpOptions);
  }

  /**
   * Método para listar a los usuarios ASPIRANTE que estén listos para presentar prueba y entrevista mediante el endpoint del backend
   * Solo está permitido para el rol de administrador.
   *
   * @params httpOptions con la autorizacion de
   * @return un listado con los usuarios
   */
  public changePass(actualContraseña: string, nuevaContraseña: string): Observable<RegisteredUser> {
    const url = `${environment.apiBaseUrl}/users/reestablecer`;
    return this.http.post<RegisteredUser>(
        url,
      {
        actualContraseña,
        nuevaContraseña,
      },
    this.httpOptions
    );
  }
}
