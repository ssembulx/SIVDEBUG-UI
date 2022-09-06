import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmittedvsclosedRoutingModule } from './submittedvsclosed-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmittedvsclosedComponent } from '../../components/submittedvsclosed/submittedvsclosed.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [SubmittedvsclosedComponent],
  imports: [
    CommonModule,
    SubmittedvsclosedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})

export class SubmittedvsclosedModule { }
