import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefectAgeingRoutingModule } from './defect-ageing-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefectAgeingComponent } from '../../components/defect-ageing/defect-ageing.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [DefectAgeingComponent],
  imports: [
    CommonModule,
    DefectAgeingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})

export class DefectAgeingModule { }
