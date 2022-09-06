import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThroughPutRoutingModule } from './through-put-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThroughPutComponent } from '../../components/through-put/through-put.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [ThroughPutComponent],
  imports: [
    CommonModule,
    ThroughPutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})

export class ThroughPutModule { }
