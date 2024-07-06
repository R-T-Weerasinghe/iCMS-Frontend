import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SettingsApiService } from '../../services/settings-api.service';

@Component({
  selector: 'settings-notifications',
  templateUrl: './settings-notifications.component.html',
  styleUrls: ['./settings-notifications.component.scss']
})

export class SettingsNotificationsComponent implements OnInit {

  NotificationChips: string[] = [];

  notificationsSettingsFormChannelConfig: FormGroup;
  selectedAlertType: any;

  constructor(
    private settingsApiService: SettingsApiService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.notificationsSettingsFormChannelConfig = this.fb.group({
      dashboardNotifications: [false],
      emailNotifications: [false],
      notificationEmails: [[Validators.email]]
    });
  }

  ngOnInit() {
    this.loadNotificationSettings();
  }

  loadNotificationSettings(): void {
    this.settingsApiService.getNotificationSettings().subscribe(
      settings => {
        this.notificationsSettingsFormChannelConfig.patchValue({
          dashboardNotifications: settings.dashboard_notifications,
          emailNotifications: settings.email_notifications,
          notificationEmails: settings.notification_emails
        });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load notification settings.' });
      }
    );
  }

  onSubmitChannelConfig(): void {
    if (this.notificationsSettingsFormChannelConfig.valid) {
      const formData = this.notificationsSettingsFormChannelConfig.value;

      const payload = {
        dashboard_notifications: formData.dashboardNotifications,
        email_notifications: formData.emailNotifications,
        notification_emails: formData.notificationEmails
      };

      this.settingsApiService.updateNotificationSettings(payload).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Channel config settings saved successfully!' });
        },
        error => {
          console.error('Failed to save channel config settings:', error);
          if (error.status === 422) {
            this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Invalid data submitted. Please check your input.' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save channel config settings.' });
          }
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter a correct email!' });
    }
  }
}
