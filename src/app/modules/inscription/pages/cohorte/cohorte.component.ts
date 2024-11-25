import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Cohorte } from 'src/app/data/interfaces/cohorte.interface';
import { CohorteService } from '../../services/cohorte.service';

import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';



@Component({
  templateUrl: './cohorte.component.html',
  styleUrls: ['./cohorte.component.css']
})
export class CohorteComponent implements OnInit{

  //Lista de cohortes
  public listCohortes: Cohorte[] = []
  // variable de control para el cohorte actual.
  public currentCohorte!: Cohorte | null;

  public selectDates = false;

  public editCohorteTrigger = false;

  public maxDate: Date   = new Date();

  public cohorteDates: FormGroup = this.fb.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  })

  constructor(
    private cohorteService: CohorteService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    //Cuando se renderice el componente, se hace el llamado a la api para pintar los cohortes en la pantalla
    this.cohorteService.cohortesList().subscribe({
      next: cohortes => {
        this.listCohortes = cohortes;
      }
    })
    this.getOpenCohorte();
  }

  /**
   * Método para obtener la información del cohorte actual abierto si hay
   */
  public getOpenCohorte(){
    this.cohorteService.currentCohorte.subscribe({
      next: cohorte => {
        this.currentCohorte = cohorte
      }
    })
  }

  /**
   * Método para cerrar un cohorte.
   */
  public closeCohorte(){
    Swal.fire({
      title: '¿Estás seguro de que desea cerrar el cohorte actual?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar',
    }).then(response => {
        if(response.isDenied || response.isDismissed)
          return

        this.cohorteService.closeCurrentCohorte().subscribe({
          next: (res):any => {

            Swal.fire({
              title: `${res.message}`,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Aceptar',
            })
          }
        });
    })
  }

  /**
   * Método para abrir un nuevo cohorte.
   */
  public openCohorteNow (){

    const data = {
      fechaInicio: this.cohorteDates.controls['startDate'].value,
      fechaFin: this.cohorteDates.controls['endDate'].value,
    }

    this.spinner.show();

    if(!this.editCohorteTrigger){
      this.openCohorte(data);
      return;
    }

    this.editCohorte(data.fechaFin);
    this.editCohorteTrigger = false;

  }

  private openCohorte (data: any){

    this.cohorteService.openNewCohorte(data).subscribe({
      next: res => {
        this.spinner.hide();
        window.location.reload();
      },
      error: err => {
        this.spinner.hide();
        console.log(err.message)
      }
    })
  }

  private editCohorte(fechaFin: Date){
    this.cohorteService.editCloseDate(fechaFin).subscribe({
      next: res => {
        this.spinner.hide();
        this.editCohorteTrigger = false;
        window.location.reload();
      },
      error: err => {
        this.spinner.hide();
      }
    })
  }

  /**
   * Método para editar la fecha de cierre del cohorte actual
   */
  public editDateClose(){
    //Asiganamos las fechas del cohorte actual al formulario reactivo
    const {fechaFin, fechaInicio } = this.currentCohorte!
    this.cohorteDates.setValue({
      startDate: new Date(fechaInicio),
      endDate: new Date(fechaFin)
    })
    this.maxDate = new Date(fechaFin)
    this.selectDates = this.editCohorteTrigger = true;
  }
}
