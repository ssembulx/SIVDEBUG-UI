import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SightingclosureefficiencyRoutingModule } from './sightingclosureefficiency-routing.module';
import { SightingclosureefficiencyComponent } from '../../components/sightingclosureefficiency/sightingclosureefficiency.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
    declarations: [SightingclosureefficiencyComponent],
    imports: [
        CommonModule,
        SightingclosureefficiencyRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ]
})
export class SightingclosureefficiencyModule { }
