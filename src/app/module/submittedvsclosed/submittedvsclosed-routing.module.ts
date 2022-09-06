import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmittedvsclosedComponent } from '../../components/submittedvsclosed/submittedvsclosed.component';

const routes: Routes = [
  {
    path: '',
    component: SubmittedvsclosedComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmittedvsclosedRoutingModule { }
