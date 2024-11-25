import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/data/interfaces/user.example.interface';
import { states } from 'src/app/data/const/states.const';
import { CohorteService } from '../../services/cohorte.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  private users!: User[];
  public userFilter!: User[];
  public nameFilter = '';
  public isOpenCohorte = false;

  constructor(
    private userS: UserService,
    private cohorteS: CohorteService,
    public auth: AuthService
  ) {
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
    return [...states.slice(2, 5)];
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
}
