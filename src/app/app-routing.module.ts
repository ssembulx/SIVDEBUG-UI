import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* import { DashboardComponent } from './components/dashboard/dashboard.component'; */
import { ErrorComponent } from './shared/components/error/error.component';
/* import { HomeComponent } from './components/home/home.component';
import { DcrComponent } from './components/dcr/dcr.component'; */
import { GeninternalsightingsComponent } from './components/geninternalsightings/geninternalsightings.component';
import { GencustomersightingsComponent } from './components/gencustomersightings/gencustomersightings.component';
/* import { TriageLatencyComponent } from './components/triage-latency/triage-latency.component';
import { DefectAgeingComponent } from './components/defect-ageing/defect-ageing.component';
import { BreakupMetricsComponent } from './components/breakup-metrics/breakup-metrics.component';
import { ThroughPutComponent } from './components/through-put/through-put.component';
import { MilestoneBlockersComponent } from './components/milestone-blockers/milestone-blockers.component';
import { SubmittedvsclosedComponent } from './components/submittedvsclosed/submittedvsclosed.component'
import { HsdPromoteComponent } from './components/hsd-promote/hsd-promote.component'; */
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { AuthGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path: 'error', component: ErrorComponent
  }, {
    path: 'AccessDenied', component: AccessDeniedComponent
  }, {
    path: 'triage-accuracy',
    loadChildren: () => import('./module/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  }, {
    path: 'dcr',
    loadChildren: () => import('./module/dcr/dcr.module').then(m => m.DcrModule),
    canActivate: [AuthGuard]
  }, {
    path: 'home',
    loadChildren: () => import('./module/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  }, {
    path: '',
    loadChildren: () => import('./module/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  }, {
    path: 'gen-internal-sightings', component: GeninternalsightingsComponent
  },
  {
    path: 'gen-customer-sightings', component: GencustomersightingsComponent
  }, {
    path: 'triage-latency',
    loadChildren: () => import('./module/triage-latency/triage-latency.module').then(m => m.TriageLatencyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'defect-ageing',
    loadChildren: () => import('./module/defect-ageing/defect-ageing.module').then(m => m.DefectAgeingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'breakup-metrics',
    loadChildren: () => import('./module/breakup-metrics/breakup-metrics.module').then(m => m.BreakupMetricsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'through-put',
    loadChildren: () => import('./module/through-put/through-put.module').then(m => m.ThroughPutModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'milestone-blockers',
    loadChildren: () => import('./module/milestone-blockers/milestone-blockers.module').then(m => m.MilestoneBlockersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'submittedvsclosed',
    loadChildren: () => import('./module/submittedvsclosed/submittedvsclosed.module').then(m => m.SubmittedvsclosedModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'hsd-promote',
    loadChildren: () => import('./module/hsd-promote/hsd-promote.module').then(m => m.HsdPromoteModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'opensightingsbyexposure',
    loadChildren: () => import('./module/opensightingsbyexposure/opensightingsbyexposure.module').then(m => m.OpensightingsbyexposureModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sightingclosureefficiency',
    loadChildren: () => import('./module/sightingclosureefficiency/sightingclosureefficiency.module').then(m => m.SightingclosureefficiencyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'opensightingageingdistribution',
    loadChildren: () => import('./module/opensightingageingdistribution/opensightingageingdistribution.module').then(m => m.OpensightingageingdistributionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'BugAssistUsage',
    loadChildren: () => import('./module/bugassistusage/bugassistusage.module').then(m => m.BugassistusageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'BugAssistWatcherAdoptionIndicator',
    loadChildren: () => import('./module/BugAssistWatcherAdoptionIndicator/BugAssistWatcherAdoptionIndicator.module').then(m => m.BugAssistWatcherAdoptionIndicatorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'StateTransition',
    loadChildren: () => import('./module/statetransaction/statetransaction.module').then(m => m.BugassistusageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }