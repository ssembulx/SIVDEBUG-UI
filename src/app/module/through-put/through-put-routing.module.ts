import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThroughPutComponent } from '../../components/through-put/through-put.component';

const routes: Routes = [
  {
    path: '',
    component: ThroughPutComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThroughPutRoutingModule { }
