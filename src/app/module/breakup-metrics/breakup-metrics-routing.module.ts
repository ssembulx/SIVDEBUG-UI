import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreakupMetricsComponent } from '../../components/breakup-metrics/breakup-metrics.component';

const routes: Routes = [
  {
    path: '',
    component: BreakupMetricsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreakupMetricsRoutingModule { }
