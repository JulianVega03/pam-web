import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from 'src/app/data/interfaces/user.example.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent implements OnChanges{
  
  
  @Input() user:User = {} as User;
  
  constructor(private datePipe: DatePipe) {}

  
  estructureTH: any[] = [
  ]
  estructureTH2: any[] = [
  ]
  estructureTH3: any[] = [
  ]
  estructureTH4: any[] = [
  ]
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.estructureTH = [
        { tableH:'nombre', value: this.user.nombre },
        { tableH:'apellido', value: this.user.apellido },
        { tableH:'Lugar de nacimiento', value: this.user.lugar_nac },
        { tableH:'Departamento de residencia', value: this.user.departamento_residencia },
        { tableH:'Municipio de residencia', value: this.user.municipio_residencia?this.user.municipio_residencia:'Extranjero' },
        { tableH:'Direccion de residencia', value: this.user.direccion_residencia },
        { tableH:'celular', value: this.user.telefono },
        { tableH:'correos', value: this.user.correoPersonal },
        { tableH:'Tipo documento de identidad', value: this.user.documentType },
        { tableH:'Número de documento', value: this.user.no_documento },
        { tableH:'Fecha expedición documento', value: this.datePipe.transform(this.user.fecha_exp_di, 'dd/MM/yyyy') },
        { tableH:'Fecha de nacimiento', value: this.datePipe.transform(this.user.fecha_nac, 'dd/MM/yyyy') },
        { tableH:'genero', value: this.user.genero },
        { tableH:'Estado Civil', value: this.user.estadoCivilTypes },
        { tableH:'Grupo Étnico', value: this.user.grupoEtnicoTypes },
        { tableH:'Pueblo indígena', value: this.user.puebloIndigenaTypes },
        { tableH:'Persona con discapacidad', value: this.user.poseeDiscapacidadTypes },
        { tableH:'Persona con Capacidad Excepcional', value: this.user.capacidadxcepcionalTypes }
      ];

      this.estructureTH2 = [
        { tableH:'Tipo Vinculación', value: this.user.tipoVinculacionTypes },
        { tableH:'Empresa donde trabaja', value: this.user.empresa_trabajo },
        { tableH:'País donde trabaja', value: this.user.pais_trabajo },
        { tableH:'Departamento donde trabaja', value: this.user.departamento_trabajo },
        { tableH:'Municipio donde trabaja', value: this.user.municipio_trabajo },
        { tableH:'Dirección donde trabaja', value: this.user.direccion_trabajo }
      ];


      this.estructureTH3 = [  
        { tableH:'Estudios Pregrado', value: this.user.estudios_pregrado },
        { tableH:'Estudios Postgrados', value: this.user.estudios_posgrados ? this.user.estudios_posgrados : 'No aplica' },
        { tableH:'Promedio Ponderado Acumulado ', value: this.user.promedioPregrado },
        { tableH:'Experiencia Laboral', value: this.user.exp_laboral },
        { tableH:'Es egreasado UFPS', value: this.user.es_egresado_ufps?'Sí':'No' }
      ];


      this.estructureTH4 = [  
        { tableH:'estado actual', value: this.user.estado?.descripcion },
        { tableH:'Sala entrevista', value: this.user.sala_entrevista ? 'Sala #' + this.user.sala_entrevista : 'Sin Asignar' },
        { tableH:'fecha entrevista', value: this.datePipe.transform(this.user.fecha_entrevista, 'dd/MM/yyyy hh:mm:ss')? 
          this.datePipe.transform(this.user.fecha_entrevista, 'dd/MM/yyyy hh:mm:ss'):'Sin Asignar' },
        { tableH:'Puntaje entrevista', value: this.user.puntaje_entrevista?this.user.puntaje_entrevista: 'Sin Asignar'  },
        { tableH:'Puntaje prueba', value: this.user.puntaje_prueba? this.user.puntaje_prueba:'Sin Asignar' },
        ];
      
    }
  }
  



  // 'celular','dirección','correo','fecha registro', 'estado actual'
}
