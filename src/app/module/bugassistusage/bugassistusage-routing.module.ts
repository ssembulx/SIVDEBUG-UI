import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BugassistusageComponent } from '../../components/bugassistusage/bugassistusage.component';

const routes: Routes = [
    {
        path: '',
        component: BugassistusageComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BugassistusageRoutingModule { }
