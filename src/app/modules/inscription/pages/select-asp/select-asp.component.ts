import { Admitido } from '../../../../data/interfaces/admitido.interface';
import { Component, OnInit } from '@angular/core';
import { CohorteService } from '../../services/cohorte.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { AspiranteService } from '../../services/aspirante.service';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-select-asp',
  templateUrl: './select-asp.component.html',
  styleUrls: ['./select-asp.component.css'],
})
export class SelectAspComponent implements OnInit {
  public isOpenCohorte = false;
  selectedIndexes: number[] = [];
  public aspirantes!: Admitido[];

  constructor(
    private cohorteS: CohorteService,
    private _aspiranteService: AspiranteService,
    public auth: AuthService,
    private _router: Router,
    private _ngxSpinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.cohorteS.currentCohorte.subscribe({
      next: (res) => {
        this.isOpenCohorte = true;
      },
    });

    this._aspiranteService.listCalificacionesPorAspirante().subscribe({
      next: (res) => {
        this.aspirantes = res;
      },
    });
  }

  toggleSelection(index: number) {
    const selectedIndex = this.selectedIndexes.indexOf(index);
    if (selectedIndex === -1) {
      this.selectedIndexes.push(index);
    } else {
      this.selectedIndexes.splice(selectedIndex, 1);
    }
  }

  admitirAspirante(aspiranteId: number) {
    this._ngxSpinner.show();
    this._aspiranteService.admitirAspirante(aspiranteId).subscribe({
      next: (res) => {
        this._ngxSpinner.hide();
        const currentUrl = this._router.url;
        const navigationExtras: NavigationExtras = {
          skipLocationChange: true,
        };
        this._router.navigateByUrl('/', navigationExtras).then(() => {
          this._router.navigate([currentUrl], navigationExtras);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
