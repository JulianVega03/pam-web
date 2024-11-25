import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { JwtService } from 'src/app/modules/auth/services/jwt.service';
import { Notificacion } from 'src/app/data/interfaces/notificacion.interface';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  listNotific: Notificacion[] = [];

  constructor(
    private notificationService: NotificationsService,
    private jwtHelper: JwtService
  ) {}

  ngOnInit(): void {
    // se hace el llamado a la api para traernos las notificaciones
    this.notificationService
      .getNotificationList({ idUser: this.jwtHelper.unDecodeAllToken().idUser })
      .subscribe({
        next: (notifications) => {
          this.listNotific = notifications;
        },
      });
    this.notificationService.checkNotifications().subscribe()
  }

  /**
   * Método para mostrar el estao de la notificación-
   * @param mensajeLeido estado de la notificacion
   * @returns Leido o no leido dependiendo del estado
   */
  public getMensajeLeido(mensajeLeido: boolean): string {
    return mensajeLeido ? 'Leído' : 'No leído';
  }
}
