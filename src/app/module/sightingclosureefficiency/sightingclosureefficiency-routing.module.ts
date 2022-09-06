import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SightingclosureefficiencyComponent } from '../../components/sightingclosureefficiency/sightingclosureefficiency.component';

const routes: Routes = [
    {
        path: '',
        component: SightingclosureefficiencyComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SightingclosureefficiencyRoutingModule { }
