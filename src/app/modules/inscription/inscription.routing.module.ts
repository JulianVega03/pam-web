import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepperComponent } from './components/stepper/stepper.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { StatusComponent } from './components/status/status.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { DashboardComponent } from 'src/app/layout/dashboard/dashboard.component';
import { TableComponent } from './pages/home/table.component';
import { DocsReviewComponent } from './pages/docs-review/docs-review.component';
import { CohorteComponent } from './pages/cohorte/cohorte.component';
import { PersonalComponent } from './pages/personal/personal.component';
import { NotificationsComponent } from 'src/app/shared/components/notifications/notifications.component';
import { EntrevistaComponent } from './pages/entrevista/entrevista.component';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { GeneralListComponent } from './pages/general-list/general-list.component';
import { SelectAspComponent } from './pages/select-asp/select-asp.component';
import { HistoricoCohorteComponent } from './pages/historico-cohorte/historico-cohorte.component';
import { ChangePassComponent } from './pages/change-pass/change-pass.component';
import { FormGuard } from 'src/app/shared/guards/form.guard';

const routes: Routes = [
  {
    path: 'aspirante',
    component: StepperComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: PersonalInfoComponent,
      },
      { path: 'personal-info', component: PersonalInfoComponent, canDeactivate: [FormGuard] },
      { path: 'documents', component: DocumentsComponent },
      { path: 'status', component: StatusComponent },
      { path: 'notifications', component: NotificationsComponent},
    ],
  },
  { path: 'notifications', component: NotificationsComponent},
  {
    path: 'aspirante',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'changeP',
        component: ChangePassComponent,
      },
    ],
  },

  {
    path: 'backlog',
    component: DashboardComponent,
    canActivateChild: [RoleGuard],
    children: [
      {
        path: 'admin',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'cohortes', component: CohorteComponent },
          { path: 'personal', component: PersonalComponent},
          { path: 'entrevista', component: EntrevistaComponent},
          { path: 'prueba', component: PruebaComponent},
          { path: 'seleccionar-admitidos', component: SelectAspComponent},
          { path: 'listado-general', component: GeneralListComponent},
          { path: 'historico-cohorte/:id', component: HistoricoCohorteComponent}
        ]
      },
      { path: 'home', component: TableComponent },
      { path: 'docs-review/:id', component: DocsReviewComponent},
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscriptionRoutingModule {}
