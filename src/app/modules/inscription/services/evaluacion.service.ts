import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from '../../auth/services/jwt.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evaluacion, Puntaje } from 'src/app/data/interfaces/cohorte.interface';

@Injectable({
  providedIn: 'root',
})
export class EvaluactionService {
  public endpoint = '';

  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: '',
    }),
  };

  constructor(private http: HttpClient, private readonly jwt: JwtService) {}

  /**
   * Método para enviar el enlace de la entrevista mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params Enlace de la entrevista y la autorización de administrador
   * @return
   */
  public linkEntrevt(enlace: string, sala = ""): Observable<Evaluacion> {
    // Url del back por post para enviar el enlace de la entrevista
    const url = `${environment.apiBaseUrl}/cohorte/entrevistaEnlace${sala}?enlace=${enlace}`;
    // Autorización como ADMIN del token para ejecutar el método
    return this.http.post<Evaluacion>(url, { enlace }, this.httpOptions);
  }

  /**
   * Método para enviar la fecha de la entrevista mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params Enlace de la entrevista y la autorización de administrador
   * @return
   */
  public fechaEntrevt(id: number, fecha: string, sala: string): Observable<Evaluacion> {
    // Url del back por post para enviar el enlace de la entrevista
    const url = `${environment.apiBaseUrl}/aspirante/horarioEntrevista?id=${id}&fecha_entrevista=${fecha}&sala=${sala}`;
    // Autorización como ADMIN del token para ejecutar el método0
    return this.http.post<Evaluacion>(url, { id, fecha }, this.httpOptions);
  }

  /**
   * Método para enviar el enlace y fecha de la prueba mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params Enlace y fecha máxima de presentación de la prueba y la autorización de administrador
   * @return
   */
  public linkPrueba(enlace: string, fechaPrueba: string): Observable<Evaluacion> {
    const url = `${environment.apiBaseUrl}/cohorte/prueba`;

    const params = new HttpParams()
      .set('enlace', enlace)
      .set('fecha_prueba', fechaPrueba.toString());

    return this.http.post<Evaluacion>(url, params, this.httpOptions);
  }
  /**
   * Método para enviar el puntaje de la entrevista mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params id del aspirante, puntaje de la entrevista y la autorización de administrador
   * @return
   */
  public punjateEntrevista(
    id: number,
    puntaje_entrevista: number
  ): Observable<Puntaje> {
    //Url del back por post para enviar el puntaje de la entrevista
    const url = `${environment.apiBaseUrl}/aspirante/calificacionEntrevista`;
    // Autorización como ADMIN del token para ejecutar el método
    return this.http.post<Puntaje>(
      url,
      { id, puntaje_entrevista },
      this.httpOptions
    );
  }
  /**
   * Método para enviar el puntaje de la prueba mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params id del aspirante, puntaje de la prueba y la autorización de administrador
   * @return
   */
  public punjatePrueba(
    id: number,
    puntaje_prueba: number
  ): Observable<Puntaje> {

    //Url del back por post para enviar el puntaje de la prueba
    const url = `${environment.apiBaseUrl}/aspirante/calificacionPrueba`;
    // Autorización como ADMIN del token para ejecutar el método
    return this.http.post<Puntaje>(
      url,
      { id, puntaje_prueba },
      this.httpOptions
    );
  }

  /**
   * Método para enviar el puntaje de los documentos mediante el endpoint del backend
   * Solo permitido para los administradores
   *
   * @params id del aspirante, puntajes de los documentos y la autorización de administrador
   * @return
   */
  public punjateDocs(
    id: number,
    puntajeCartasReferencia: number,
    puntajeNotasPregrado: number,
    puntajePublicaciones: number,
    puntajeDistincionesAcad: number,
    puntajeExperiencia: number
  ): Observable<Puntaje> {
    //Url del back por post para enviar el puntaje de la prueba
    const url = `${environment.apiBaseUrl}/aspirante/calificacionDocumentos`;
    // Autorización como ADMIN del token para ejecutar el método
    return this.http.post<Puntaje>(
      url,
      {
        id,
        puntajeCartasReferencia,
        puntajeNotasPregrado,
        puntajePublicaciones,
        puntajeDistincionesAcad,
        puntajeExperiencia,
      },
      this.httpOptions
    );
  }
}
