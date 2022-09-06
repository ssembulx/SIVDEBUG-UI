import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefectAgeingComponent } from '../../components/defect-ageing/defect-ageing.component';

const routes: Routes = [
  {
    path: '',
    component: DefectAgeingComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefectAgeingRoutingModule { }
