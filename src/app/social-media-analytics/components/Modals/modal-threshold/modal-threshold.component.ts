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

@Component({
  selector: 'modal-threshold',
  templateUrl: './modal-threshold.component.html',
  styleUrls: ['./modal-threshold.component.scss'],
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
export class ModalThresholdComponent implements OnInit {
  notificationTypes: any[] = [];
  selectedNotificationType: any;
  topBarCaption: string = "Add New";
  visible: boolean = false;

  minValue: number = 0;
  maxValue: number = 0;

  platforms: any[] = [];
  selectedPlatform: any;

  modalsetThresholdForm: FormGroup;
  isEditMode: boolean = false;
  currentThresholdId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private settingsApiService: SettingsApiService,
    private messageService: MessageService
  ) {
    this.modalsetThresholdForm = this.formBuilder.group({
      sm_id: ['', Validators.required],
      alert_type: ['', Validators.required],
      min_val: ['', Validators.required],
      max_val: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.notificationTypes = [
      { name: 'Email Notification', icon: 'assets/social-media/icons/email-notification.png' },
      { name: 'APP Notification', icon: 'assets/social-media/icons/APP-notification.png' }
    ];
    this.platforms = [
      { name: 'Facebook', icon: 'assets/social-media/icons/facebook.png' },
      { name: 'Instagram', icon: 'assets/social-media/icons/instargram.png' },
    ];
  }

  showDialog(thresholdData?: any) {
    this.visible = true;
    this.isEditMode = !!thresholdData;
    this.topBarCaption = this.isEditMode ? 'Edit Threshold' : 'Add New';

    if (thresholdData) {
      this.currentThresholdId = thresholdData.id;
      this.modalsetThresholdForm.patchValue({
        sm_id: this.platforms.find(p => p.name === this.getPlatformName(thresholdData.sm_id)),
        alert_type: this.notificationTypes.find(nt => nt.name === this.getNotificationTypeName(thresholdData.alert_type)),
        min_val: thresholdData.min_val,
        max_val: thresholdData.max_val,
      });
    } else {
      this.modalsetThresholdForm.reset();
    }
  }

  getPlatformName(smId: string): string {
    switch (smId) {
      case 'SM01':
        return 'Facebook';
      case 'SM02':
        return 'Instagram';
      default:
        return '';
    }
  }

  getNotificationTypeName(alertType: string): string {
    switch (alertType) {
      case 'email':
        return 'Email Notification';
      case 'app':
        return 'APP Notification';
      default:
        return '';
    }
  }

  onSubmitSetThresoldForm() {
    if (this.modalsetThresholdForm.valid) {
      const formData = this.modalsetThresholdForm.value;
      formData.alert_type = formData.alert_type.name === 'Email Notification' ? 'email' : 'app';
      formData.sm_id = this.getPlatformId(formData.sm_id.name);

      if (this.isEditMode && this.currentThresholdId) {
        this.settingsApiService.updateSentimentShift(this.currentThresholdId, formData).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Threshold updated successfully' });
            this.visible = false;
            this.modalsetThresholdForm.reset();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail || 'Error adding alert' });
          }
        );
      } else {
        this.settingsApiService.setSentimentShift(formData).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Threshold added successfully' });
            this.visible = false;
            this.modalsetThresholdForm.reset();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail || 'Error adding alert' });
          }
        );
      }
    } else {
      console.log(this.modalsetThresholdForm);
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields' });
    }
  }

  getPlatformId(platformName: string): string {
    switch (platformName) {
      case 'Facebook':
        return 'SM01';
      case 'Instagram':
        return 'SM02';
      default:
        return '';
    }
  }
}
