import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpensightingsbyexposureRoutingModule } from './opensightingsbyexposure-routing.module';
import { OpensightingsbyexposureComponent } from '../../components/opensightingsbyexposure/opensightingsbyexposure.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
    declarations: [OpensightingsbyexposureComponent],
    imports: [
        CommonModule,
        OpensightingsbyexposureRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule
    ]
})
export class OpensightingsbyexposureModule { }
