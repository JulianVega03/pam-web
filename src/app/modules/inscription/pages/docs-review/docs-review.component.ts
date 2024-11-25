import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/data/interfaces/user.example.interface';
import { UserService } from '../../services/user.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-docs-review',
  templateUrl: './docs-review.component.html',
  styleUrls: ['./docs-review.component.css']
})
export class DocsReviewComponent implements OnInit {

  private currentTabIndex = 0;
  private _user!:User;
  private id!:number;

  constructor(
    private router: ActivatedRoute,
    private userS: UserService,
    private _router: Router
  ){
      router.params.subscribe({
        next: params => {
         this.id = parseInt(params['id']);
        }
      })

      this.userS.getUser(this.id).pipe(
        tap(user => this._user = user)
      ).subscribe();
  }

  ngOnInit(): void {
    // Obtengo al usuario de la base de datos;
    return
  }

  public get currentTab(){
    return this.currentTabIndex
  }

  public get user(){
    return {...this._user}
  }

  /**
   * Método para cambiar entre los tabs
   * @param index
   */
  public changeCurrentTabIndex(index: number){
    this.currentTabIndex = index;
  }
}
