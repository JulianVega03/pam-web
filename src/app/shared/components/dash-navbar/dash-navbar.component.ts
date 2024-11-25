/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-output-native */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { NotificationsService } from '../services/notifications.service';
import { JwtService } from 'src/app/modules/auth/services/jwt.service';
import { Notificacion } from 'src/app/data/interfaces/notificacion.interface';
import { Role } from 'src/app/data/enums/rol.enum';
import { map } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dash-navbar',
  templateUrl: './dash-navbar.component.html',
  styleUrls: ['./dash-navbar.component.css'],
})
export class DashNavbarComponent implements OnInit {

  @Output() close = new EventEmitter<boolean>();
  private flagClose = false;

  private _showNotifications = false;

  public isNewUser = true;

  private _roleUser = ''

  public user:any = {}

  public notificationsList: Notificacion[] = [];

  constructor(
    private _authService: AuthService,
    private notificationsS: NotificationsService,
    private jwt : JwtService,
    private router: Router
  ) {}

  public get showNotifications(){
    return this._showNotifications
  }


  ngOnInit(): void {
    this._authService.currentUser.subscribe({
      next: user => {
        this.user = user ?? {}
      }
    })

    if(this.user.role == Role.USUARIO){
      this.notificationsS.getNotificationList({idUser: this.jwt.unDecodeAllToken().idUser}).subscribe({
        next: noti => {
          this.notificationsList = noti.filter(notification => ! notification.estado);
  
          if(this.notificationsList.length > 3)
            this.notificationsList =  this.notificationsList.slice(0,3)
        }
      })
    }
  }

  public get notifications(){
    return this.notificationsList
  }

  public get notificationsContainer() {
    return this._showNotifications;
  }

  public closeNav() {
    this.flagClose = !this.flagClose;
    this.close.emit(this.flagClose);
  }

  public logout() {

    if(this.user.role == Role.USUARIO && this.user.status == 1){
      this.router.navigate(['/auth']);
      return;
    }
    this._authService.logout();
  }

  public showNotificaciones() {
    return this._showNotifications = !this._showNotifications;
  }

  public validateRole(){
    // obtengo las autorizaciones
    this._authService.currentUser.subscribe({
      next: ({role}) => this._roleUser = role
    })

  }

  public showNotificationPage(){
    this.notificationsList.length = 0;
    this.router.navigate(['/inscription/notifications']);
  }
}
