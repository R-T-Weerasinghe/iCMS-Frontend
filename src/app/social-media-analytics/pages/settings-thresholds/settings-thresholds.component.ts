import { Component, OnInit, ViewChild } from '@angular/core';
import { Thresholds } from '../../models/settings';
import { MessageService } from 'primeng/api';
import { SettingsApiService } from '../../services/settings-api.service';
import { ModalThresholdComponent } from '../../components/Modals/modal-threshold/modal-threshold.component';


@Component({
  selector: 'settings-thresholds',
  templateUrl: './settings-thresholds.component.html',
  styleUrls: ['./settings-thresholds.component.scss']
})

export class SettingsThresholdsComponent implements OnInit {
  topBarCaption: string = "Add New";
  thresholds: Thresholds[] = [];

  @ViewChild(ModalThresholdComponent) modalThresholdComponent!: ModalThresholdComponent;

  constructor(
    private settingsApiService: SettingsApiService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.settingsApiService.getSentimentShift().subscribe((response: Thresholds[]) => {
      const list_thresholds = response;
      list_thresholds.forEach((item: any) => {
        if (item.sm_id === 'SM01') {
          item.platform = "Facebook";
        } else {
          item.platform = "Instagram";
        }
      });
      this.thresholds = list_thresholds;
    }, (error) => {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Error fetching Data"});
    });
  }

  openAddNew() {
    this.modalThresholdComponent.showDialog();
  }

  onRowEdit(item: Thresholds): void {
    this.modalThresholdComponent.showDialog(item);
  }

  onRowDelete(item: Thresholds): void {
    this.settingsApiService.deleteThreshold(item.id).subscribe(() => {
      this.thresholds = this.thresholds.filter((val: Thresholds) => val.id !== item.id);
      this.messageService.add({ severity: "success", summary: "Success", detail: "Threshold Deleted Successfully"});
    }, (error) => {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Error Deleting Threshold"});
    });
  }

}
