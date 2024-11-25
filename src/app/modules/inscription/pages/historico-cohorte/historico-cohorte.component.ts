import { Component, OnInit } from '@angular/core';
import { AspiranteService } from '../../services/aspirante.service';
import { Aspirante } from 'src/app/data/interfaces/aspirante.interface';
import { ActivatedRoute } from '@angular/router';
import { DocsService } from '../../services/docs.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as saveAs from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-historico-cohorte',
  templateUrl: './historico-cohorte.component.html',
  styleUrls: ['./historico-cohorte.component.css'],
})
export class HistoricoCohorteComponent implements OnInit {
  public aspirantes!: Aspirante[];
  public aspiranteNombre = '';
  public aspiranteApellido = '';
  public aspiranteCalificacion: Aspirante[] = [];
  public cohorteId = 0;

  constructor(
    private _aspiranteService: AspiranteService,
    private _router: ActivatedRoute,
    private _docsService: DocsService,
    private _spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this._router.params.subscribe({
      next: (params) => {
        this.cohorteId = parseInt(params['id']);
      },
    });

    this._aspiranteService.listHistoricoCohortes(this.cohorteId).subscribe({
      next: (res) => {
        this.aspirantes = res;
      },
    });
  }

  descargarDocumentosAspirante(aspiranteId: number) {
    this._spinner.show();

    const getInformacionObs =
      this._aspiranteService.getInformacionAspirante(aspiranteId);
    const downloadDocsObs = this._docsService.downloadDocuments(aspiranteId);

    forkJoin([getInformacionObs, downloadDocsObs]).subscribe({
      next: ([informacionRes, downloadRes]) => {
        this.aspiranteNombre = informacionRes.nombre;
        this.aspiranteApellido = informacionRes.apellido;

        this._spinner.hide();
        saveAs(
          downloadRes,
          `documentos_${this.aspiranteNombre}_${this.aspiranteApellido}.zip`
        );
      },
      error: (err) => {
        this._spinner.hide();
        console.log(err);
      },
    });
  }

  descargarCalificacionesAspirante(aspiranteId: number) {
    this._aspiranteService
      .getInformacionAspirante(aspiranteId)
      .subscribe({
        next: (res) => {
          this.aspiranteCalificacion = res;

          const headers = [
            'Nombre',
            'Apellido',
            'Puntaje de documentos',
            'Puntaje de la Prueba',
            'Puntaje de la Entrevista',
            'Puntaje Final',
          ];

          this.aspiranteNombre = res.nombre;
          this.aspiranteApellido = res.apellido;
          console.log(res);

          const tableData = [
            headers, // Include headers as the first row
            [
              res.nombre !== undefined ? res.nombre.toString() : '',
              res.apellido !== undefined ? res.apellido.toString() : '',
              res.puntajeDocumentos !== undefined
                ? res.puntajeDocumentos.toString()
                : '',
              res.puntaje_entrevista !== undefined
                ? res.puntaje_entrevista.toString()
                : '',
              res.puntaje_prueba !== undefined
                ? res.puntaje_prueba.toString()
                : '',
              res.total !== undefined && res.total !== null
                ? res.total.toString()
                : '',
            ],
          ];

          const imageUrl = '../../../../../assets/ufpslogo.png'; // Update the image URL

          fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const dataURL = reader.result as string;

                const documentDefinition = {
                  content: [
                    // Header
                    {
                      columns: [
                        {
                          image: dataURL,
                          width: 50,
                          height: 50,
                          margin: [10, 10, 10, 10],
                        },
                        {
                          text: `Puntajes de ${this.aspiranteNombre} ${this.aspiranteApellido}`,
                          style: 'header',
                          alignment: 'center',
                          margin: [10, 20],
                        },
                      ],
                    },
                    // Table
                    {
                      table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*', '*'],
                        body: [headers, ...tableData],
                      },
                      layout: {
                        fillColor: function (
                          rowIndex: number,
                          node: any,
                          columnIndex: any
                        ) {
                          return rowIndex === 0 ? '#CCCCCC' : null; // Header row color
                        },
                      },
                    },
                    // Footer
                    {
                      text: 'Universidad Francisco de Paula Santander',
                      alignment: 'right',
                      margin: [10, 10, 10, 0],
                      fontSize: 10,
                      color: '#999999',
                    },
                  ],
                  styles: {
                    header: {
                      fontSize: 18,
                      bold: true,
                      margin: [0, 0, 0, 10],
                    },
                  },
                };

                pdfMake
                  .createPdf(documentDefinition)
                  .download(
                    `puntajes_${this.aspiranteNombre}_${this.aspiranteApellido}.pdf`
                  );
              };
              reader.readAsDataURL(blob);
            });
        },
      });
  }
}
