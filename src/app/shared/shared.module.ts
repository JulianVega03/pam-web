import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '../modules/prime-ng/prime-ng.module';
import { DashNavbarComponent } from './components/dash-navbar/dash-navbar.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor.interceptor';
import { NotiPipe } from './pipes/noti.pipe';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    DashNavbarComponent,
    SidebarComponent,
    NotificationsComponent,
    NotFoundComponent,
    NotiPipe
  ],
  exports: [
    DashNavbarComponent,
    SidebarComponent,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    NgxSpinnerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    [CookieService],
  ]
})
export class SharedModule {}
