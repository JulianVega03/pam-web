/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { S3Service } from '../../services/s3.service';
import { DocsService } from '../../services/docs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  public listDocumentsUser: any = [];

  constructor(
    private s3: S3Service,
    private docService: DocsService,
    private spinner: NgxSpinnerService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.docService.listUserDocuments().subscribe({
      next: (res: any) => {
        this.listDocumentsUser = res;
      },
    });
  }

  public changeTitle(input: HTMLInputElement, btnElement: HTMLElement) {
    const file = input.files![0];
    if (file)
      btnElement.innerText =
        file.name.length > 15 ? file.name.substring(0, 14) + '...' : file.name;
    else btnElement.innerText = 'Seleccionar';
  }

  public submitDocument(id: number, input: HTMLInputElement, index: number) {
    const file = input.files![0];

    if (!file) return;

    if (file.size / 1024 / 1024 > 5.0) {
      swal.fire({
        title: `Tamaño excedido`,
        text: `Solo se admiten archivos de máximo 5Mb`,
        icon: 'warning',
        confirmButtonColor: '#007f5f',
        confirmButtonText: 'Confirmar',
      });
      return;
    }

    this.spinner.show();

    this.s3.uploadFile(id, input.files![0]).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.listDocumentsUser[index].estado.id = 2;
        swal.fire({
          title: `Documento enviado con éxito`,
          text: `${res.message}`,
          icon: 'success',
          confirmButtonColor: '#007f5f',
          confirmButtonText: 'Confirmar',
        });
      },
      error: (err) => {
        this.spinner.hide();
        swal.fire({
          title: `Ocurrio un error! `,
          text: `Ha ocurrido un error. Intente de nuevo. Si el problema persiste comuniquese con nosotros.`,
          icon: 'error',
          confirmButtonColor: '#007f5f',
          confirmButtonText: 'Confirmar',
        });
      },
    });
  }

  public bgColorState(id: number) {
    const bgOptions: { [key: number]: string } = {
      1: 'bg-[#354f52]',
      2: 'bg-[#6b9080]',
      3: 'bg-[#da1e37]',
      4: 'bg-[#0ead69]',
    };
    return bgOptions[id];
  }

  public showFinishInscription() {
    return this.listDocumentsUser.every(
      (document: any) => document.estado.id != 1
    );
  }

  public getAcceptTypeFile(id: number) {
    if (id == 1)
      return 'image/jpeg, image/png';

    if(id == 7)
      return 'image/jpeg, application/pdf'

    return '.pdf, application/pdf';
  }

  public getExtensionDocument(id: number) {
    if (id == 1)
      return 'jpg, png, jpeg';

    if(id == 7)
      return 'pdf o imagen'
    return 'pdf';
  }
}
