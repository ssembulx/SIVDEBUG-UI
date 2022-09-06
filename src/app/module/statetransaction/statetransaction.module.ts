import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatetransactionRoutingModule } from './statetransaction-routing.module';
import { StatetransactionComponent } from '../../components/statetransaction/statetransaction.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [StatetransactionComponent],
  imports: [
    CommonModule,
    StatetransactionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class BugassistusageModule { }
