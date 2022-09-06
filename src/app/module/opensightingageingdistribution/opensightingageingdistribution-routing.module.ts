import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpensightingageingdistributionComponent } from '../../components/opensightingageingdistribution/opensightingageingdistribution.component';

const routes: Routes = [
    {
        path: '',
        component: OpensightingageingdistributionComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OpensightingageingdistributionRoutingModule { }
