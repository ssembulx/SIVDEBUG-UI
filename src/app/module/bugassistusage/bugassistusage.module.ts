import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BugassistusageRoutingModule } from './bugassistusage-routing.module';
import { BugassistusageComponent } from '../../components/bugassistusage/bugassistusage.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [BugassistusageComponent],
  imports: [
    CommonModule,
    BugassistusageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class BugassistusageModule { }
