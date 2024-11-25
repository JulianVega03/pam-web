import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

const routes: Routes = [
  {
    path: 'sign-in',
    children: [
      {
        path: 'aspirante',
        component: SignInComponent
      }
    ],
  },
  {
    path: 'sign-up',
    children: [
      {
        path: 'nuevo-aspirante',
        component: SignUpComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'sign-in/aspirante'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingRoutingModule { }
