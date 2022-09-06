import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MilestoneBlockersComponent } from '../../components/milestone-blockers/milestone-blockers.component';

const routes: Routes = [
  {
    path: '',
    component: MilestoneBlockersComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MilestoneBlockersRoutingModule { }
