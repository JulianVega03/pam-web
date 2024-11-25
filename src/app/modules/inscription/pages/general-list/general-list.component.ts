import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/data/interfaces/user.example.interface';
import { UserService } from '../../services/user.service';
import { CohorteService } from '../../services/cohorte.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { states } from 'src/app/data/const/states.const';
import { AspiranteService } from '../../services/aspirante.service';
import { Admitido } from 'src/app/data/interfaces/admitido.interface';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-general-list',
  templateUrl: './general-list.component.html',
  styleUrls: ['./general-list.component.css'],
})
export class GeneralListComponent implements OnInit {
  private users!: User[];
  public userFilter!: User[];
  public nameFilter = '';
  public isOpenCohorte = false;
  public admitidos: Admitido[] = [];

  constructor(
    private userS: UserService,
    private cohorteS: CohorteService,
    public auth: AuthService,
    private _aspiranteService: AspiranteService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.cohorteS.currentCohorte.subscribe({
      next: (res) => {
        if (res != null) this.isOpenCohorte = true;
      },
    });

    this.userS.listUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.userFilter = [...this.users];
      },
    });
  }

  public get filterOptions() {
    return [...states];
  }

  public get usersList() {
    return [...this.users];
  }

  public filter(event: any) {
    const { id } = event.value;
    this.userS.listUsers(id).subscribe({
      next: (users) => {
        this.users = users;
        this.userFilter = [...this.users];
      },
    });
  }

  public searchUserByName() {
    this.userFilter = this.users.filter((user) => {
      const fullName = `${user.nombre} ${user.apellido}`;
      return fullName
        .trim()
        .toLowerCase()
        .includes(this.nameFilter.trim().toLowerCase());
    });
  }

  exportAdmitidosToPDF() {
    this._aspiranteService.listAdmitidos().subscribe({
      next: (res: Admitido[]) => {
        const selectedAspirantes = res;

        const headers = ['Nombre', 'Apellido'];
        const tableData = selectedAspirantes.map((admitido) => [
          admitido.nombre,
          admitido.apellido,
        ]);

        const imageUrl = '../../../../../assets/ufpslogo.png'; // Update the image URL

        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataURL = reader.result as string;

              const documentDefinition = {
                content: [
                  {
                    columns: [
                      {
                        image: dataURL,
                        width: 80,
                        margin: [0, 10, 0, 10], // Adjust the margin as per your requirement
                      },
                      {
                        text: 'Lista de Admitidos',
                        style: 'header',
                        alignment: 'center',
                        margin: [10, 20], // Adjust the margin as per your requirement
                      },
                    ],
                  },
                  {
                    table: {
                      headerRows: 1,
                      widths: ['*', '*'],
                      body: [headers, ...tableData],
                    },
                  },
                ],
                styles: {
                  header: {
                    fontSize: 20,
                    bold: true,
                    margin: [0, 0, 0, 10],
                  },
                  table: {
                    margin: [0, 10, 0, 10],
                  },
                },
              };

              pdfMake.createPdf(documentDefinition).download('admitidos.pdf');
            };
            reader.readAsDataURL(blob);
          });
      },
    });
  }


  rechazarAdmision(aspiranteId: number) {
    this._aspiranteService.rechazarAdmision(aspiranteId).subscribe({
      next: (res) => {
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
