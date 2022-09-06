import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BugAssistWatcherAdoptionIndicatorRoutingModule } from './BugAssistWatcherAdoptionIndicator-routing.module';
import { BugAssistWatcherAdoptionIndicatorComponent } from '../../components/bug-assist-watcher-adoption-indicator/bug-assist-watcher-adoption-indicator.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
    declarations: [BugAssistWatcherAdoptionIndicatorComponent],
    imports: [
        CommonModule,
        BugAssistWatcherAdoptionIndicatorRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ]
})
export class BugAssistWatcherAdoptionIndicatorModule { }
