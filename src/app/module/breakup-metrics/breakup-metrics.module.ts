import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakupMetricsRoutingModule } from './breakup-metrics-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreakupMetricsComponent } from '../../components/breakup-metrics/breakup-metrics.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [BreakupMetricsComponent],
  imports: [
    CommonModule,
    BreakupMetricsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class BreakupMetricsModule { }
