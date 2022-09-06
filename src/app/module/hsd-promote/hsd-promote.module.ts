import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsdPromoteRoutingModule } from './hsd-promote-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HsdPromoteComponent } from '../../components/hsd-promote/hsd-promote.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [HsdPromoteComponent],
  imports: [
    CommonModule,
    HsdPromoteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class HsdPromoteModule { }
