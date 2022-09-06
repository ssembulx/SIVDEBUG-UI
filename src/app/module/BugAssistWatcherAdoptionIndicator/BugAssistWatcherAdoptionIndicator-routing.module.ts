import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BugAssistWatcherAdoptionIndicatorComponent } from '../../components/bug-assist-watcher-adoption-indicator/bug-assist-watcher-adoption-indicator.component';

const routes: Routes = [
    {
        path: '',
        component: BugAssistWatcherAdoptionIndicatorComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BugAssistWatcherAdoptionIndicatorRoutingModule { }
