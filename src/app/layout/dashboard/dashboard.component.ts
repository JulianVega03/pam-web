/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component } from '@angular/core';
import { ISidebar } from 'src/app/data/interfaces/ISidebar.interface';
import { sidebarItems } from 'src/app/data/const/sideItems.const'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  open: boolean = false
  items: ISidebar[] = sidebarItems;

  closeNav(event: boolean){
    this.open = event
  }
}
