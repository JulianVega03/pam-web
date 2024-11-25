/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import { EvaluactionService } from '../../services/evaluacion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/modules/auth/services/jwt.service';
import { environment } from 'src/environments/environment';
import { DatosEval } from 'src/app/data/interfaces/cohorte.interface';
import { AspiranteService } from '../../services/aspirante.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit {
  public data: any;
  public usuarioid = 0;
  public fechaEntrevista: any;
  public fechaPrueba: any;
  public horaEntrevista: any;
  public horaPrueba: any;
  public enlaceEntrevista: any;
  public enlacePrueba: any;
  public admitido = '';
  public showDE = false;
  public showDP = false;
  public message = 'No asignado';
  public dateE = '';
  public dateP = '';

  constructor(
    private http: HttpClient,
    private _jwt: JwtService,
    private _aspiranteService: AspiranteService
  ) {}

  ngOnInit(): void {
    const userDataString = localStorage.getItem('user');

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.usuarioid = userData.id;
    }

    this._aspiranteService
      .obtenerInfoAspirante()
      .subscribe((response) => {
        console.log(response);
        this.admitido = response.estado.descripcion;
      });

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this._jwt.getToken(),
      }),
    };

    this.http
      .get<DatosEval>(
        `${environment.apiBaseUrl}/aspirante/entrevistaPrueba`,
        httpOptions
      )
      .subscribe((response) => {
        this.data = response;

        this.dateE = this.data.fecha_entrevista;
        this.dateP = this.data.fechaMaxPrueba;

        this.enlaceEntrevista = this.data.enlace_entrevista;
        this.enlacePrueba = this.data.enlace_prueba;

        if(this.dateE != null){
          const fechaE = new Date(this.dateE);
          this.showDE = true;
          this.fechaEntrevista = `${fechaE.getDate()}/${
            fechaE.getMonth() + 1
          }/${fechaE.getFullYear()}`;
          let hour = fechaE.getHours();
          const minute = fechaE.getMinutes();
          const period = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12 || 12;
          this.horaEntrevista = `${hour}:${minute
            .toString()
            .padStart(2, '0')} ${period}`;
        }

        if(this.dateP != null){
          const fechaP = new Date(this.dateP);
          this.showDP = true;
          this.fechaPrueba = `${fechaP.getDate()}/${
            fechaP.getMonth() + 1
          }/${fechaP.getFullYear()}`;
          let hora = fechaP.getHours();
          const minutos = fechaP.getMinutes();
          const periodo = hora >= 12 ? 'PM' : 'AM';
          hora = hora % 12 || 12;
          this.horaPrueba = `${hora}:${minutos
            .toString()
            .padStart(2, '0')} ${periodo}`;
        }
      });
  }
}
