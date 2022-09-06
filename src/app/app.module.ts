import { APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterceptorService } from './helpers/interceptor.service';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
/* import { DashboardComponent } from './components/dashboard/dashboard.component'; */
import { AccountService } from './services/account.service';
import { AccountModel } from './models/account.model';
import { HelperService } from './shared/services/helper.service';

/* import { HomeComponent } from './components/home/home.component'; */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlerService } from './helpers/error-handler.service';
import { DashboardService } from './services/dashboard.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
/* import { DcrComponent } from './components/dcr/dcr.component'; */
import { NgxSpinnerModule } from "ngx-spinner";
import { GeninternalsightingsComponent } from './components/geninternalsightings/geninternalsightings.component';
import { GencustomersightingsComponent } from './components/gencustomersightings/gencustomersightings.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { BugassistusageComponent } from './components/bugassistusage/bugassistusage.component';
import { StatetransactionComponent } from './components/statetransaction/statetransaction.component';
/* import { BugAssistWatcherAdoptionIndicatorComponent } from './components/bug-assist-watcher-adoption-indicator/bug-assist-watcher-adoption-indicator.component'; */
/* import { SightingclosureefficiencyComponent } from './components/sightingclosureefficiency/sightingclosureefficiency.component';
import { OpensightingageingdistributionComponent } from './components/opensightingageingdistribution/opensightingageingdistribution.component'; */
/* import { OpensightingsbyexposureComponent } from './components/opensightingsbyexposure/opensightingsbyexposure.component'; */
/* import { TriageLatencyComponent } from './components/triage-latency/triage-latency.component'; */
/* import { DefectAgeingComponent } from './components/defect-ageing/defect-ageing.component'; */
/* import { BreakupMetricsComponent } from './components/breakup-metrics/breakup-metrics.component'; */
/* import { ThroughPutComponent } from './components/through-put/through-put.component'; */
/* import { MilestoneBlockersComponent } from './components/milestone-blockers/milestone-blockers.component'; */
/* import { SubmittedvsclosedComponent } from './components/submittedvsclosed/submittedvsclosed.component'; */
/* import { HsdPromoteComponent } from './components/hsd-promote/hsd-promote.component'; */

export function initConfig(service: AccountService, helper: HelperService) {
  var p = new Promise<void>((resolve, reject) => {
    /* service.GetUser().subscribe(user => {
      helper.SetUser(user);
      resolve();
    }); */
    resolve();
  });
  return (): Promise<any> => {
    return p;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    /* DashboardComponent, */
    /* HomeComponent, */
    /* DcrComponent, */
    GeninternalsightingsComponent,
    GencustomersightingsComponent,
    AccessDeniedComponent,
    /* StatetransactionComponent, */
    /* BugAssistWatcherAdoptionIndicatorComponent, */
    /* BugassistusageComponent, */
    /*  SightingclosureefficiencyComponent,
     OpensightingageingdistributionComponent, */
    /* OpensightingsbyexposureComponent, */
    /* TriageLatencyComponent, */
    /* DefectAgeingComponent, */
    /* BreakupMetricsComponent, */
    /* ThroughPutComponent, */
    /* MilestoneBlockersComponent, */
    /* SubmittedvsclosedComponent, */
    /* HsdPromoteComponent */
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DashboardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      deps: [AccountService, HelperService],
      multi: true,
      useFactory: initConfig
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
