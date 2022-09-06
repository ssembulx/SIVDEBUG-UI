import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatetransactionComponent } from '../../components/statetransaction/statetransaction.component';

const routes: Routes = [
    {
        path: '',
        component: StatetransactionComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatetransactionRoutingModule { }
