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
    lugar_nac: string,
    departamento_residencia: string,
    municipio_residencia: string,
    direccion_residencia: string,
    telefono: string,
    documentType: string,
    no_documento: string,
    fecha_exp_di: Date,
    fecha_nac: Date,
    genero: string,
    estadoCivilTypes: string,
    zonaResidenciaTypes: string,
    grupoEtnicoTypes: string,
    puebloIndigenaTypes: string,
    otroPueblo: string,
    poseeDiscapacidadTypes: string,
    discapacidadTypes: string,
    capacidadxcepcionalTypes: string,
    departamento_trabajo: string,
    tipoVinculacionTypes: string,
    empresa_trabajo: string,
    pais_trabajo: string,
    municipio_trabajo: string,
    direccion_trabajo: string,
    estudios_pregrado: string,
    estudios_posgrados: string,
    promedioPregrado: string,
    exp_laboral: string,
    es_egresado_ufps: boolean,
    lugarExpedicion: string
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
        documentType,
        no_documento,
        departamento_trabajo,
        departamento_residencia,
        municipio_residencia,
        direccion_residencia,
        zonaResidenciaTypes,
        telefono,
        estadoCivilTypes,
        puebloIndigenaTypes,
        tipoVinculacionTypes,
        empresa_trabajo,
        pais_trabajo,
        grupoEtnicoTypes,
        otroPueblo,
        poseeDiscapacidadTypes,
        discapacidadTypes,
        capacidadxcepcionalTypes,
        municipio_trabajo,
        direccion_trabajo,
        estudios_pregrado,
        estudios_posgrados,
        exp_laboral,
        es_egresado_ufps,
        promedioPregrado,
        lugarExpedicion
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
