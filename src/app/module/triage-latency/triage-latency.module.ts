import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TriageLatencyRoutingModule } from './triage-latency-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TriageLatencyComponent } from '../../components/triage-latency/triage-latency.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [TriageLatencyComponent],
  imports: [
    CommonModule,
    TriageLatencyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})

export class TriageLatencyModule { }
