import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertItem } from '../../models/settings';
import { MessageService } from 'primeng/api';
import { SettingsApiService } from '../../services/settings-api.service';
import { ModalAlertComponent } from '../../components/Modals/modal-alert/modal-alert.component';

@Component({
  selector: 'settings-alerts',
  templateUrl: './settings-alerts.component.html',
  styleUrls: ['./settings-alerts.component.scss']
})

export class SettingsAlerts implements OnInit {
  list_alerts: AlertItem[] = [];

  @ViewChild(ModalAlertComponent) modalAlertComponent!: ModalAlertComponent;

  constructor(
    private settingsApiService: SettingsApiService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.settingsApiService.getTopicAlerts().subscribe(
      (response: AlertItem[]) => {
        this.list_alerts = response;
      },
      error => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Error fetching Data" });
      }
    );
  }

  openAddNew() {
    this.modalAlertComponent.showDialog();
  }

  onRowEdit(item: AlertItem): void {
    this.modalAlertComponent.showDialog(item);
  }

  onRowDelete(item: AlertItem): void {
    this.settingsApiService.deleteAlertItem(item.id).subscribe(() => {
      this.list_alerts = this.list_alerts.filter((val: AlertItem) => val.id !== item.id);
      this.messageService.add({ severity: "success", summary: "Success", detail: "Threshold Deleted Successfully" });
    }, (error) => {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Error Deleting Data" });
    });
  }

  topBarCaption = "Add New";
}
