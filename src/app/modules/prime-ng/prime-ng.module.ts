import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  exports : [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule,
    StepsModule,
    ToastModule,
    CalendarModule,
    RadioButtonModule,
    InputNumberModule,
    CascadeSelectModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    InputTextareaModule,
    FileUploadModule,
    InputMaskModule,
    KeyFilterModule,
    CardModule,
    BadgeModule,
    DialogModule,
    TooltipModule
  ],
  providers: [
    { provide: MessageService, useClass: MessageService },
  ],
})
export class PrimeNGModule { }
