import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainDashboardRoutingModule } from './main-dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DoughnutChartComponent } from './components/charts/doughnut-chart/doughnut-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import {ChartModule} from "primeng/chart";
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/user-profile/edit-profile/edit-profile.component';
import { UserNotificationComponent } from './components/user-profile/user-notification/user-notification.component';
import { UserSecurityComponent } from './components/user-profile/user-security/user-security.component';
import {TabViewModule} from "primeng/tabview";
import {SharedModule} from "../shared/shared.module";
import {ButtonModule} from "primeng/button";
import {ImageModule} from "primeng/image";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputSwitchModule} from "primeng/inputswitch";
import {PasswordModule} from "primeng/password";
import { NotificationsComponent } from './components/notifications/notifications.component';


import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { UnreadNotificationsComponent } from './components/notifications/unread-notifications/unread-notifications.component';
import { ReadNotificationsComponent } from './components/notifications/read-notifications/read-notifications.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DoughnutChartComponent,
    LineChartComponent,
    UserProfileComponent,
    EditProfileComponent,
    UserNotificationComponent,
    UserSecurityComponent,
    NotificationsComponent,
    UnreadNotificationsComponent,
    ReadNotificationsComponent,

  ],
  imports: [
    CommonModule,
    MainDashboardRoutingModule,
    ChartModule,
    TabViewModule,
    SharedModule,
    ButtonModule,
    ImageModule,
    FormsModule,
    InputTextModule,
    InputSwitchModule,
    PasswordModule,
    HttpClientModule,
    MessagesModule,
    ConfirmPopupModule,
    ToastModule,
    DialogModule,
    AvatarModule,
    AvatarGroupModule
  ],
  providers:[ConfirmationService]
})
export class MainDashboardModule { }