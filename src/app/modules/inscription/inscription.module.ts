import { CommonModule, DatePipe } from "@angular/common";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { StepperComponent } from "./components/stepper/stepper.component";
import { PersonalInfoComponent } from "./components/personal-info/personal-info.component";
import { NgModule, PipeTransform } from '@angular/core';
import { InscriptionRoutingModule } from "./inscription.routing.module";
import { RouterModule } from '@angular/router';
import { DocumentsComponent } from "./components/documents/documents.component";
import { StatusComponent } from "./components/status/status.component";
import { TableComponent } from './pages/home/table.component';
import { HttpClientModule } from '@angular/common/http';
import { DocsReviewComponent } from './pages/docs-review/docs-review.component';
import { TableUserComponent } from './components/table-info/table-user.component';
import { DocumentsViewsComponent } from './components/documents-views/documents-views.component';
import { SharedModule } from "src/app/shared/shared.module";
import { CohorteComponent } from "./pages/cohorte/cohorte.component";
import { PersonalComponent } from "./pages/personal/personal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PruebaComponent } from "./pages/prueba/prueba.component";
import { EntrevistaComponent } from "./pages/entrevista/entrevista.component";
import { GeneralListComponent } from "./pages/general-list/general-list.component";
import { SelectAspComponent } from "./pages/select-asp/select-asp.component";
import { HistoricoCohorteComponent } from "./pages/historico-cohorte/historico-cohorte.component";
import { StatePipe } from "./pipes/state.pipe";
import { ChangePassComponent } from "./pages/change-pass/change-pass.component";

@NgModule({
  declarations: [
    StepperComponent,
    PersonalInfoComponent,
    ChangePassComponent,
    DocumentsComponent,
    StatusComponent,
    TableComponent,
    DocsReviewComponent,
    DocumentsViewsComponent,
    TableUserComponent,
    CohorteComponent,
    PersonalComponent,
    EntrevistaComponent,
    PruebaComponent,
    SelectAspComponent,
    GeneralListComponent,
    HistoricoCohorteComponent,
    StatePipe
  ],
  imports: [
    CommonModule,
    InscriptionRoutingModule,
    AngularMaterialModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  providers: [DatePipe],
})
export class InscriptionModule { }
