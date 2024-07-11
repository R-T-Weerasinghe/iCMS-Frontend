import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from "primeng/api";
import UserMessages from "../../../shared/user-messages";
import { DashboardApiService } from '../../services/dashboard-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [
    { label: "Social Media Analytics", routerLink: "/social-media/dashboard" },
    { label: "Dashboard" }
  ];

  loadingFacebookScore: boolean = true;
  loadingInstagramScore: boolean = true;
  loadingDoughnut: boolean = true;
  loadingWordCloudKeywords: boolean = true;
  loadingWordCloudProduct: boolean = true;
  loadingChartFacebook: boolean = true;
  loadingChartInstagram: boolean = true;
  loadingProductTrend: boolean = true;

  facebookScore: number = 0;
  instagramScore: number = 0;
  data_doughnut: number[] = [];
  wordCloudKeywordsData: any[] = [];
  wordCloudProductData: any[] = [];
  chartFacebookData: any;
  chartInstagramData: any;
  productTrendData: any[] = [];
  isError: boolean = false;
  protected readonly userMessages = UserMessages;

  constructor(
    private DashboardApiService: DashboardApiService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    var tomorrow = new Date();
    var lastMonth = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    lastMonth.setMonth(tomorrow.getMonth() - 1);
    this.fetchDashboardData(lastMonth.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]);

    this.DashboardApiService.getProductTrends().subscribe((data: any) => {
      this.productTrendData = data;
      this.loadingProductTrend = false;
    }, (error: any) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });
  }

  fetchDashboardData(Date: string, Date2: string) {
    this.DashboardApiService.getSentimentPercentage(Date, Date2).subscribe((data: any) => {
      this.data_doughnut = data.percentage;
      this.loadingDoughnut = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.DashboardApiService.getSentimentScoreFacebook(Date, Date2).subscribe((data: number) => {
      this.facebookScore = data;
      this.loadingFacebookScore = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.DashboardApiService.getSentimentScoreInstagram(Date, Date2).subscribe((data: number) => {
      this.instagramScore = data;
      this.loadingInstagramScore = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.DashboardApiService.getKeywordTrendData(Date, Date2).subscribe((data: any) => {
      this.wordCloudKeywordsData = data;
      this.loadingWordCloudKeywords = false;
    }, (error: any) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.DashboardApiService.getProductTrendData(Date, Date2).subscribe((data: any) => {
      this.wordCloudProductData = data;
      this.loadingWordCloudProduct = false;
    }, (error: any) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.DashboardApiService.getFacebookAnalysisData(Date, Date2).subscribe((data: any) => {
      this.chartFacebookData = data;
      this.loadingChartFacebook = false;
    }, (error: any) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.DashboardApiService.getInstagramAnalysisData(Date, Date2).subscribe((data: any) => {
      this.chartInstagramData = data;
      this.loadingChartInstagram = false;
    }, (error: any) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

  }

  DateChanged(start: string, end: string): void {
    this.loadingFacebookScore = true;
    this.loadingInstagramScore = true;
    this.loadingDoughnut = true;
    this.loadingWordCloudKeywords = true;
    this.loadingWordCloudProduct = true;
    this.loadingChartFacebook = true;
    this.loadingChartInstagram = true;
    this.isError = false;
    
    const startDate = start.split('-').slice(0, 3).join('-');
    const endDate = end.split('-').slice(0, 3).join('-');
    this.fetchDashboardData(startDate, endDate);
  }

}
