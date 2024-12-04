import { Injectable } from '@angular/core';
import { Applicant } from '../interfaces/applicant';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  constructor(private http: HttpClient, private jwt: JwtService) {}

  public registerApplicant(
    nombre: string,
    apellido: string,
    genero: string,
    lugar_nac: string,
    fecha_exp_di: Date,
    fecha_nac: Date,
    no_documento: string,
    departamento_residencia: string,
    departamento_trabajo: string,
    municipio_residencia: string,
    direccion_residencia: string,
    telefono: string,
    empresa_trabajo: string,
    pais_trabajo: string,
    municipio_trabajo: string,
    direccion_trabajo: string,
    estudios_pregrado: string,
    estudios_posgrados: string,
    exp_laboral: string,
    es_egresado_ufps: boolean
  ): Observable<Applicant> {
    const url = `${environment.apiBaseUrl}/aspirante`;

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.jwt.getToken(),
      }),
    };

    return this.http.post<Applicant>(
      url,
      {
        nombre,
        apellido,
        genero,
        lugar_nac,
        fecha_exp_di,
        fecha_nac,
        no_documento,
        departamento_trabajo,
        departamento_residencia,
        municipio_residencia,
        direccion_residencia,
        telefono,
        empresa_trabajo,
        pais_trabajo,
        municipio_trabajo,
        direccion_trabajo,
        estudios_pregrado,
        estudios_posgrados,
        exp_laboral,
        es_egresado_ufps,
      },
      httpOptions
    );
  }

  public getApplicant(idAccount: number): Observable<Applicant> {
    return this.http.get<Applicant>(
      `${environment.apiBaseUrl}/aspirante/${idAccount}`,
      { headers: new HttpHeaders({ Authorization: '' }) }
    );
  }
}
