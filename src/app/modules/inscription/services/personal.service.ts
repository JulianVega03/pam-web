import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from '../../auth/services/jwt.service';
import { environment } from 'src/environments/environment';
import { RegisteredUser, Personal } from '../../auth/interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonalService {

  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.jwt.getToken(),
    }),
  };

  constructor(private http: HttpClient, private readonly jwt: JwtService) {}

  /**
   * Método para registrar a un usuario PERSONAL/AUXILIARES mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params Correo y contraseña del usuario AUXILIAR a registrar y la autorización de administrador
   * @return
   */
  public register(email: string, password: string): Observable<RegisteredUser> {
    // Url del back por post para registrar encargados
    const url = `${environment.apiBaseUrl}/users/encargado`;
    // Autorización como ADMIN del token para ejecutar el método
    return this.http.post<RegisteredUser>(
      url,
      {
        email,
        password,
      },
      this.httpOptions
    );
  }

  /**
   * Método para listar a todos los usuarios PERSONAL/AUXILIARES mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params
   * @return la lista de los usuarios AUXILIAR
   */
  public listPersonals(): Observable<Personal[]> {
    // Url del back por get para listar encargados
    const url = `${environment.apiBaseUrl}/users/ROLE_ENCARGADO`;
    // Autorización como ADMIN del token para ejecutar el método
    return this.http.get<Personal[]>(url, this.httpOptions);
  }

  /**
   * Método para borrar al usuario PERSONAL/AUXILIARES mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params email del usuario AUXILIAR a eliminar
   * @return
   */
  public deletePersonals(email: string): Observable<Personal[]> {
    // Url del back por delete para eliminar encargados
    const url = `${environment.apiBaseUrl}/users/eliminar/${email}`;
    // Autorización como ADMIN del token para ejecutar el método
    return this.http.delete<Personal[]>(url, this.httpOptions);
  }
}
