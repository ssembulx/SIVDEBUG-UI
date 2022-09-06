import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MilestoneBlockersRoutingModule } from './milestone-blockers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MilestoneBlockersComponent } from '../../components/milestone-blockers/milestone-blockers.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [MilestoneBlockersComponent],
  imports: [
    CommonModule,
    MilestoneBlockersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})

export class MilestoneBlockersModule { }
