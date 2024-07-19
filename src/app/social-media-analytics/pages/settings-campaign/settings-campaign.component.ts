import { Component, OnInit, ViewChild } from '@angular/core';
import { Campaign } from '../../models/settings';
import { MessageService } from 'primeng/api';
import { SettingsApiService } from '../../services/settings-api.service';
import { ModalCampaignComponent } from '../../components/Modals/modal-campaign/modal-campaign.component';

@Component({
  selector: 'settings-campaign',
  templateUrl: './settings-campaign.component.html',
  styleUrls: ['./settings-campaign.component.scss']
})


export class SettingsCampaignComponent implements OnInit {

  tabFacebook = { title: 'Facebook', img: 'assets/social-media/icons/facebook.png' };
  tabInstagram = { title: 'Instagram', img: 'assets/social-media/icons/instargram.png' };

  contentFacebook = { subtitle: 'Facebook', data: [] as Campaign[] };
  contentInstagram = { subtitle: 'Instagram', data: [] as Campaign[] };

  @ViewChild(ModalCampaignComponent) modalCampaignComponent!: ModalCampaignComponent;

  constructor(
    private settingsApiService: SettingsApiService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchCampaignsBySM();
  }

  fetchCampaignsBySM(): void {
    this.settingsApiService.getCampaigns().subscribe(
      (response) => {

        const FacebookData: Campaign[] = response["SM01" as keyof typeof response] as Campaign[];
        FacebookData.forEach((item: any) => {
          if (item.description.length > 40) {
            item.description = item.description.slice(0, 40) + '...';
          }
          item.s_score = Math.round(item.s_score*100);
        });
        this.contentFacebook.data = FacebookData;

        const InstagramData: Campaign[] = response["SM02" as keyof typeof response] as Campaign[];
        InstagramData.forEach((item: any) => {
          if (item.description.length > 40) {
            item.description = item.description.slice(0, 40) + '...';
          }
          item.s_score = Math.round(item.s_score*100);
        });
        this.contentInstagram.data = InstagramData;

      },
      error => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Error fetching Data"});
      }
    );
  }

  openAddNew() {
    this.modalCampaignComponent.showDialog();
  }

  onRowDelete(item: Campaign): void {
    this.settingsApiService.deleteCampaign(item.id).subscribe(() => {
      if (this.contentFacebook.data.includes(item)) {
        this.contentFacebook.data = this.contentFacebook.data.filter((val: Campaign) => val.id !== item.id);
      } else {
        this.contentInstagram.data = this.contentInstagram.data.filter((val: Campaign) => val.id !== item.id);
      }
      this.messageService.add({ severity: "success", summary: "Success", detail: "Campaign Deleted Successfully"});
    }, (error) => {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Error Deleting Campaign"});
    });
 }
  topBarCaption = 'Add New';
}
