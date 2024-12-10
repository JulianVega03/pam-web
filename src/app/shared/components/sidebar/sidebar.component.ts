import { Component, Input, OnInit } from '@angular/core';
import { ISidebar } from 'src/app/data/interfaces/ISidebar.interface';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ExcelService } from 'src/app/modules/inscription/services/excel.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit{

  @Input() items!: ISidebar[];
  public user:any = {}

  constructor(
    private auth: AuthService,
    private excelService: ExcelService
  ){ }

  ngOnInit(): void {
    this.auth.currentUser.subscribe({
      next: (user) => this.user = user ?? {}
    })
  }

  public hasRole(optionRole: string[]){
    return optionRole.includes(this.user.role);
  }

  onDownloadExcel(): void {
    this.excelService.downloadExcelAllAspirantes().subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reporte-aspirantes.xlsx'; 
        link.click();
        window.URL.revokeObjectURL(url); 
      },
      error: (err) => {
        console.error('Error downloading the file', err);
      }
    });
  }

}
