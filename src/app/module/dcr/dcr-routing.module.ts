import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DcrComponent } from '../../components/dcr/dcr.component';

const routes: Routes = [
  {
    path: '',
    component: DcrComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DcrRoutingModule { }
