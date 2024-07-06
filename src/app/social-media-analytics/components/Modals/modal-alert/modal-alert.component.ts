import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SettingsApiService } from '../../../services/settings-api.service';
import { ToastModule } from 'primeng/toast';

interface NotificationType {
  name: string;
  icon: string;
}

@Component({
  selector: 'modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss'],
  standalone: true,
  imports: [
    ToastModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule
  ]
})
export class ModalAlertComponent implements OnInit {

  notificationTypes: NotificationType[] = [];
  selectedNotificationType: NotificationType | undefined;
  topBarCaption: string = "Add New";
  visible: boolean = false;

  modalSetAlertForm: FormGroup;
  isEditMode: boolean = false;
  currentAlertId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private settingsApiService: SettingsApiService,
    private messageService: MessageService) {
    this.modalSetAlertForm = this.formBuilder.group({
      product: ['', Validators.required],
      min_val: ['', Validators.required],
      max_val: ['', Validators.required],
      alert_type: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.notificationTypes = [
      { name: 'Email Notification', icon: 'assets/social-media/icons/email-notification.png' },
      { name: 'App Notification', icon: 'assets/social-media/icons/APP-notification.png' }
    ];
  }

  showDialog(alertData?: any) {
    this.visible = true;
    this.isEditMode = !!alertData;
    this.topBarCaption = this.isEditMode ? 'Edit Alert' : 'Add New';

    if (alertData) {
      this.currentAlertId = alertData.id;
      this.modalSetAlertForm.patchValue({
        product: alertData.product,
        min_val: alertData.min_val,
        max_val: alertData.max_val,
        alert_type: this.notificationTypes.find(nt => nt.name === this.getNotificationTypeName(alertData.alert_type)),
      });
    } else {
      this.modalSetAlertForm.reset();
    }
  }

  getNotificationTypeName(alertType: string): string {
    switch (alertType) {
      case 'email':
        return 'Email Notification';
      case 'app':
        return 'App Notification';
      default:
        return '';
    }
  }

  onSubmitModalSetAlertForm() {
    if (this.modalSetAlertForm.valid) {
      const formData = this.modalSetAlertForm.value;
      formData.alert_type = formData.alert_type.name === 'Email Notification' ? 'email' : 'app';

      if (this.isEditMode && this.currentAlertId) {
        this.settingsApiService.updateTopicAlerts(this.currentAlertId, formData).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Alert updated successfully' });
            this.visible = false;
            this.modalSetAlertForm.reset();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail || 'Error adding alert' });
          }
        );
      } else {
        this.settingsApiService.setTopicAlerts(formData).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Alert added successfully' });
            this.visible = false;
            this.modalSetAlertForm.reset();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail || 'Error adding alert' });
          }
        );
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields' });
    }
  }
}