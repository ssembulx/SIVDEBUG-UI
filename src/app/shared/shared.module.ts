import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LegendComponent } from './components/legend/legend.component';
import { ChartComponent } from './components/chart/chart.component';
import { ErrorComponent } from './components/error/error.component';
import { MaterialModule } from '../material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetComponent } from './components/widget/widget.component';

@NgModule({
  declarations: [LegendComponent, ChartComponent, ErrorComponent, WidgetComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    NgbModule,
    LegendComponent,
    ChartComponent,
    ErrorComponent,
    WidgetComponent
  ]
})
export class SharedModule { }
