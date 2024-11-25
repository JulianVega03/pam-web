import { Component, Input, OnInit } from '@angular/core';
import { ISidebar } from 'src/app/data/interfaces/ISidebar.interface';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit{

  @Input() items!: ISidebar[];
  public user:any = {}

  constructor(
    private auth: AuthService
  ){ }

  ngOnInit(): void {
    this.auth.currentUser.subscribe({
      next: (user) => this.user = user ?? {}
    })
  }

  public hasRole(optionRole: string[]){
    return optionRole.includes(this.user.role);
  }

}
