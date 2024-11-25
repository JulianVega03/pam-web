import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit{

  constructor(
    private router: Router,
    private auth: AuthService
  ){}


  ngOnInit(): void {
    this.navigateByRole();
  }

  public navigateByRole(){
    this.auth.currentUser.subscribe({
      next: (user) => {
        
        if(user == null)
          return 
          
        if(user.role == 'ADMIN')
          this.router.navigate(['/inscription/backlog/home'])

        if(user.role == 'ENCARGADO')
          this.router.navigate(['/inscription/backlog/home'])
        
        if(user.role == 'USUARIO')
          this.router.navigate(['/inscription/aspirante'])
        
      }
    })
  }
  
}
