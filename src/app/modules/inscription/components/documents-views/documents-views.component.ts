import { Router, NavigationExtras } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { JwtService } from 'src/app/modules/auth/services/jwt.service';
import { DocsService } from '../../services/docs.service';
import { tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluactionService } from '../../services/evaluacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documents-views',
  templateUrl: './documents-views.component.html',
  styleUrls: ['./documents-views.component.css'],
})
export class DocumentsViewsComponent implements OnInit {
  public isConfirmed = false;

  public docs!: any;

  public docmn = '';

  public state!: any;

  public rejectDoc!: any;

  public selectReject = '';

  public message = '';

  public other = '';

  public showModalReject = false;

  @Input() user!: any;

  public visible = false;

  public hideButton = true;

  public role = '';


  public puntajeDocumentosForm: FormGroup = this._fb.group({
    pPU: ['', [Validators.required]],
    pCR: ['', [Validators.required]],
    pNP: ['', [Validators.required]],
    pDA: ['', [Validators.required]],
    pEL: ['', [Validators.required]],
  });

  constructor(
    private http: HttpClient,
    private jwt: JwtService,
    private docService: DocsService,
    private spinner: NgxSpinnerService,
    private _fb: FormBuilder,
    private _evalService: EvaluactionService,
  ) {}

  public showDialog() {
    this.visible = true;
  }

  /**
   * Método para activar el botón siempre y cuando no hayan errores en los inputs del formulario
   *
   * @params
   * @return
   */
  public onSave(): void {
    if (this.puntajeDocumentosForm.invalid) {
      this.puntajeDocumentosForm.markAllAsTouched();
      return;
    }
  }

  /**
   * Método para validar los inputs que no queden vacíos y se activen las validaciones
   *
   * @params Input a validar
   * @return
   */
  public isValidField(field: string): boolean | null {
    {
      return (
        this.puntajeDocumentosForm.controls[field].touched &&
        this.puntajeDocumentosForm.controls[field].pristine
      );
    }
  }

  /**
   * Método para validar que los puntajes no sean mayores a lo estipulado
   *
   * @params Input a validar y el puntaje máximo estipulado
   * @return true or false de acuerdo a si cumple al condicion
   */
  public isMaxValueExceeded(field: string, maxValue: number): boolean | null {
    const control = this.puntajeDocumentosForm.get(field);
    if (control && control.value > maxValue) {
      return true;
    }
    return false;
  }


  ngOnInit(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.jwt.getToken(),
      }),
    };
    this.http.get( `${environment.apiBaseUrl}/doc/listarDoc?aspiranteId=${this.user.id}`,
        httpOptions).subscribe((docs) => {
        this.docs = docs;
        this.state = this.user.estado.id;
        this.calificarDocs();

      });
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        this.role = userData.role;
      }

  }

  public calificarDocs(){
    if (this.state < 4) {
      this.message = 'El aspirante aún no tiene aprobados todos los documentos';
        this.hideButton = false;
    } else {
      if (this.state === 4) {
        this.hideButton = true;
      } else {
        if (this.state > 4) {
          this.message = 'El aspirante ya cuenta con los documentos calificados';
          this.hideButton = false;
        }
      }
    }
  }


  public confirmTrigger(document: string, idDoc: number, index: number) {
    Swal.fire({
      title: `¿Estás seguro de que deseas aprobar el documento ${document}?`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
    }).then((result) => {
      if (result.isDenied || result.dismiss) {
        return;
      }
      this.spinner.show();
      // hago el llamado a la api
      this.docService
        .acceptDoc({ idDoc, idAspirant: this.user.id })
        .pipe(
          tap((doc) => {
            //TODO: esto se tiene que cambiar, no es lo ideal. Se debe de implementar bloquear los botones.
            this.docs[index].estado.id = 4;
            this.docs[index].estado.nombre = 'aprobado';
            this.hideButton = this.docs.every((doc: any) => doc.estado.id === 4);
          })
        )
        .subscribe({
          next: (res) => {
            this.spinner.hide();
          },
        });
    });
  }

  public getColorTarget(estado: number) {
    const classNg: { [key: number]: string } = {
      1: 'bg-gray-200',
      2: 'bg-[#e9c46a]',
      3: 'bg-red-500 text-white',
      4: 'bg-green-500 text-white',
    };
    return classNg[estado];
  }

  public rejectDocument(option: number) {
    if (option == -1) {
      this.showModalReject = false;
      return;
    }

    const data = {
      docId: this.rejectDoc.documento.id,
      aspiranteId: this.user.id,
      retroalimentacion:
        this.selectReject === 'Otro' ? this.other : this.selectReject,
    };
    this.showModalReject = false;
    this.spinner.show();
    this.docService
      .rejectDoc(data)
      .pipe(
        tap((doc) => {
          const index = this.docs.findIndex(
            (doc: any) => doc.documento.id === this.rejectDoc.documento.id
          );
          this.docs[index].estado.id = 3;
          this.docs[index].estado.nombre = 'Rechazado';
        })
      )
      .subscribe({
        next: (res) => {
          this.spinner.hide();
        },
      });
  }

  public reject(doc: any) {
    this.showModalReject = true;
    this.rejectDoc = doc;
  }

  public downloadAllDocuments() {
    this.spinner.show();
    this.docService.downloadDocuments(this.user.id).subscribe({
      next: (res) => {
        this.spinner.hide();
        saveAs(
          res,
          `${this.user.id}. ${this.user.nombre + ' ' + this.user.apellido}.zip`
        );
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      },
    });
  }

  /**
   * Método para enviar el puntaje de la entrevista a los aspirantes
   *
   * @params id del aspirante y los puntajes del formulario
   * @return
   */
  public sendPuntaje(id: number) {
    const pDA = this.puntajeDocumentosForm.get('pDA')?.value;
    const pCR = this.puntajeDocumentosForm.get('pCR')?.value;
    const pNP = this.puntajeDocumentosForm.get('pNP')?.value;
    const pPU = this.puntajeDocumentosForm.get('pPU')?.value;
    const pEL = this.puntajeDocumentosForm.get('pEL')?.value;
    this._evalService.punjateDocs(id, pCR, pNP, pPU, pDA, pEL).subscribe({
      next: (ok) => {
        this.hideButton = false;
        this.visible = false;
        this.message = 'El aspirante ya cuenta con los documentos calificados';
        Swal.fire({
          title: 'Puntajes enviados correctamente',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        })
      },
    });
  }
}
