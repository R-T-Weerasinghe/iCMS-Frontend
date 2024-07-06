import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { CallRecordingsComponent } from './components/call-recordings/call-recordings.component';
import { CallFilteringComponent } from './components/call-filtering/call-filtering.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { CallOperatorsComponent } from "./components/call-operators/call-operators.component";
import { callUploadGuard } from "./guards/call-upload.guard";
import { callSettingsGuard } from "./guards/call-settings.guard";
import { callAnalyticsGuard } from "./guards/call-analytics.guard";
import { callOperatorsGuard } from "./guards/call-operators.guard";
import { callFilterGuard } from "./guards/call-filter.guard";
import { callRecordingsGuard } from "./guards/call-recordings.guard";


const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [callAnalyticsGuard]
  },
  {
    path: "recordings",
    component: CallRecordingsComponent,
    canActivate: [callRecordingsGuard]
  },
  {
    path: "filtering",
    component: CallFilteringComponent,
    canActivate: [callFilterGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [callSettingsGuard]
  },
  {
    path: "upload",
    component: FileUploadComponent,
    canActivate: [callUploadGuard]
  },
  {
    path: "operators",
    component: CallOperatorsComponent,
    canActivate: [callOperatorsGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallAnalyticsRoutingModule {}
