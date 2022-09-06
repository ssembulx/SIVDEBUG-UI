import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DcrRoutingModule } from './dcr-routing.module';
import { DcrComponent } from '../../components/dcr/dcr.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [DcrComponent],
  imports: [
    CommonModule,
    DcrRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class DcrModule { }
