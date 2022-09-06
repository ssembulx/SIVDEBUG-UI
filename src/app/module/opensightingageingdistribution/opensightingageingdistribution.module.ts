import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpensightingageingdistributionRoutingModule } from './opensightingageingdistribution-routing.module';
import { OpensightingageingdistributionComponent } from '../../components/opensightingageingdistribution/opensightingageingdistribution.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
    declarations: [OpensightingageingdistributionComponent],
    imports: [
        CommonModule,
        OpensightingageingdistributionRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ]
})
export class OpensightingageingdistributionModule { }
