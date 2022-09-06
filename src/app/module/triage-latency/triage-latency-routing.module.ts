import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TriageLatencyComponent } from '../../components/triage-latency/triage-latency.component';

const routes: Routes = [
  {
    path: '',
    component: TriageLatencyComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TriageLatencyRoutingModule { }
