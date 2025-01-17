import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from "primeng/api";
import { CampaignAnalysisApiService } from '../../services/campaign-analysis-api.service';
import { TabStateService } from '../../services/tab-state.service';
import UserMessages from "../../../shared/user-messages";
import { Subscription } from 'rxjs';
import { ModalCampaignComponent } from '../../components/Modals/modal-campaign/modal-campaign.component';

@Component({
  selector: 'app-ca',
  templateUrl: './ca.component.html',
  styleUrls: ['./ca.component.scss']
})
export class CAComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  isError: boolean = false;
  protected readonly userMessages = UserMessages;

  breadcrumbItems: MenuItem[] = [
    { label: "Social Media Analytics", routerLink: "/social-media/dashboard" },
    { label: "Campaign Analysis" }
  ];

  private subscription: Subscription = new Subscription();

  tabFacebook = { title: 'Facebook', img: 'assets/social-media/icons/facebook.png' };
  tabInstagram = { title: 'Instagram', img: 'assets/social-media/icons/instargram.png' };

  caPageContent = { subtitle: 'Top Performing Campaigns', topCampaigns: [], additionalCampaigns: [] };

  topBarCaption = "Add New:";
  showAdditionalCards: boolean = false;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  @ViewChild(ModalCampaignComponent) modalCampaignComponent!: ModalCampaignComponent;

  constructor(
    private campaignAnalysisApiService: CampaignAnalysisApiService,
    private tabStateService: TabStateService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.tabStateService.activeTab$.subscribe((tabName: string) => {

      let platform = "SM01";
      if (tabName === "Instagram") {
        platform = "SM02";
      }
      this.loading = true;

      this.campaignAnalysisApiService.getCAData(platform).subscribe(response => {
        const campaignsContent = response;
        campaignsContent.forEach((item: any) => {
          if (item.description.length > 40) {
            item.description = item.description.slice(0, 40) + '...';
          }
          item.dataSentimentLabels = Array.from({ length: item.s_score_arr.length }, (_, i) => `${i + 1}`);
        });

        // this.caPageContent.topCampaigns = campaignsContent;
        this.caPageContent.topCampaigns = campaignsContent.filter((item: any) => item.s_score_arr[item.s_score_arr.length - 1] >= -0.2);
        this.caPageContent.additionalCampaigns = campaignsContent.filter((item: any) => item.s_score_arr[item.s_score_arr.length - 1] < -0.2);

        this.loading = false;
      }, (error) => {
        this.isError = true;
        this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openAddNew() {
    this.modalCampaignComponent.showDialog();
  }

  toggleAdditionalCards(): void {
    this.showAdditionalCards = !this.showAdditionalCards;
  }
}
