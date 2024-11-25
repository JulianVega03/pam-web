import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from 'src/app/data/interfaces/user.example.interface';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent implements OnChanges{
  
  
  @Input() user:User = {} as User;
  
  
  estructureTH: any[] = [
  ]
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.estructureTH = [
        { tableH:'nombre', value: this.user.nombre },
        { tableH:'apellido', value: this.user.apellido },
        { tableH: 'celular', value: this.user.telefono },
        { tableH:'correos', value: this.user.correoPersonal },
        { tableH:'estado actual', value: this.user.estado?.descripcion }
      ];
    }
  }
  



  // 'celular','dirección','correo','fecha registro', 'estado actual'
}
