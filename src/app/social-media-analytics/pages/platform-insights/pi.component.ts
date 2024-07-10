import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from "primeng/api";
import { PiPageItem } from '../../models/platform-insights';
import { PlatformInsightsApiService } from '../../services/platform-insights-api.service';
import UserMessages from "../../../shared/user-messages";
import { TabStateService } from '../../services/tab-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pi',
  templateUrl: './pi.component.html',
  styleUrls: ['./pi.component.scss']
})

export class PIComponent implements OnInit, OnDestroy {
  loadingReactions: boolean = true;
  loadingComments: boolean = true;
  loadingHighlightedComments: boolean = true;
  loadingSentiment: boolean = true;
  loadingKeywordTrends: boolean = true;
  isError: boolean = false;
  protected readonly userMessages = UserMessages;

  items: any;
  platform = "SM01";
  DataReactions: any;
  DataComments: any;
  DataSentimentOverTime: any;
  DataKeywordThrends: any;
  OptionsSideCards: any;
  OptionsKeywordThrends: any;
  OptionsSentimentOverTime: any;

  private subscription: Subscription = new Subscription();

  constructor(
    private platformInsightsApiService: PlatformInsightsApiService,
    private tabStateService: TabStateService,
    private messageService: MessageService,
  ) { }


  ngOnInit() {
    var tomorrow = new Date();
    var lastMonth = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    lastMonth.setMonth(tomorrow.getMonth() - 1);
    this.subscription = this.tabStateService.activeTab$.subscribe((tabName: string) => {
      if (tabName === "Instagram") {
        this.platform = "SM02";
      } else {
        this.platform = "SM01";
      }

      this.loadingReactions = true;
      this.loadingComments = true;
      this.loadingHighlightedComments = true;
      this.loadingSentiment = true;
      this.loadingKeywordTrends = true;
      this.isError = false;

      this.fetchDashboardData(lastMonth.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]);
    });
  }

  fetchDashboardData(Date: string, Date2: string) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.platformInsightsApiService.getKeywordTrendCount(this.platform, Date, Date2).subscribe(response => {

      // ############ 0: Keyword Trends ############

      const topic_sentiments = response;

      function hexToRgba(hex: string, alpha: number): string {
        hex = hex.replace(/^#/, '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      
      topic_sentiments.bordercolors = topic_sentiments.colors.map((color: string) => {
        return hexToRgba(color, 0.9);
      });     

      topic_sentiments.colors = topic_sentiments.colors.map((color: string) => {
        return hexToRgba(color, 0.1);
      });
      
      this.DataKeywordThrends = {
        labels: topic_sentiments.products,
        datasets: [
          {
            data: topic_sentiments.s_scores,
            backgroundColor: topic_sentiments.colors,
            borderColor: topic_sentiments.bordercolors,
            borderWidth: 2
          }
        ]
      };
      this.loadingKeywordTrends = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.platformInsightsApiService.getTotalReactions(this.platform, Date, Date2).subscribe(response => {

      // ############ 1: Get total reactions of posts ############

      const total_reactions = response;

      let totalReactionsLabels: string[] = [];
      let totalReactionsData: any[] = [];

      for (const [key, value] of Object.entries(total_reactions)) {
        totalReactionsLabels.push(key);
        totalReactionsData.push(value);
      }

      this.DataReactions = {
        labels: totalReactionsLabels,
        datasets: [
          {
            label: 'Reactions',
            data: totalReactionsData,
            fill: false,
            borderColor: "#fff",
            tension: 0.2
          }
        ]
      };
      this.loadingReactions = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.platformInsightsApiService.getTotalComments(this.platform, Date, Date2).subscribe(response => {

      // ############ 2: Get total comments of posts ############

      const total_comments = response;

      let totalCommentsLabels: string[] = [];
      let totalCommentsData: any[] = [];

      for (const [key, value] of Object.entries(total_comments)) {
        totalCommentsLabels.push(key);
        totalCommentsData.push(value);
      }

      this.DataComments = {
        labels: totalCommentsLabels,
        datasets: [
          {
            label: 'Comments',
            data: totalCommentsData,
            fill: false,
            borderColor: "#fff",
            tension: 0.2
          }
        ]
      };
      this.loadingComments = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.platformInsightsApiService.getHighlightedComments(this.platform, Date, Date2).subscribe(response => {

      // ############ 3: Get Highlighted comments ############

      const highlighted_comments = response;
      highlighted_comments.forEach((item: any) => {
        if (item.description.length > 100) {
          item.description = item.description.slice(0, 150) + '...';
        }
        item.s_score = Math.round((item.s_score + 1) * 50);
      });
      this.items = highlighted_comments;
      this.loadingHighlightedComments = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });

    this.platformInsightsApiService.getAverageSentimentScore(this.platform, Date, Date2).subscribe(response => {

      // ############ 4: Get average sentiment score of comments and reacts ############
      const sentiment_scores = response;

      let SentimentOverTimeLabels: string[] = [];
      let SentimentOverTimeSubCommentsData: (number | null)[] = [];
      let SentimentOverTimeCommentsData: (number | null)[] = [];

      const allDates = Array.from(
        new Set([...Object.keys(sentiment_scores.comments), ...Object.keys(sentiment_scores.subcomments)])
      ).sort();

      SentimentOverTimeLabels = allDates;
      SentimentOverTimeCommentsData = new Array(allDates.length).fill(null);
      SentimentOverTimeSubCommentsData = new Array(allDates.length).fill(null);

      for (const [key, value] of Object.entries(sentiment_scores.comments)) {
        const index = SentimentOverTimeLabels.indexOf(key);
        SentimentOverTimeCommentsData[index] = value as number;
      }

      for (const [key, value] of Object.entries(sentiment_scores.subcomments)) {
        const index = SentimentOverTimeLabels.indexOf(key);
        SentimentOverTimeSubCommentsData[index] = value as number;
      }

      this.DataSentimentOverTime = {
        labels: SentimentOverTimeLabels,
        datasets: [
          {
            label: 'Sub Comments',
            data: SentimentOverTimeSubCommentsData,
            fill: false,
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            tension: 0.2,
            spanGaps: true
          },
          {
            label: 'Comments',
            data: SentimentOverTimeCommentsData,
            fill: false,
            borderColor: documentStyle.getPropertyValue('--pink-500'),
            tension: 0.2,
            spanGaps: true
          }
        ]
      };
      this.loadingSentiment = false;
    }, (error) => {
      this.isError = true;
      this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
    });


    this.OptionsKeywordThrends = {
      maintainAspectRatio: false,
      aspectRatio: 0.65,
      plugins: {
        legend: {
          display: false
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.OptionsSideCards = {
      maintainAspectRatio: false,
      aspectRatio: 2,
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      },
      plugins: {
        legend: {
          display: false
        },
      },
    };

    this.OptionsSentimentOverTime = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  DateChanged(start: string, end: string): void {
    this.loadingReactions = true;
    this.loadingComments = true;
    this.loadingHighlightedComments = true;
    this.loadingSentiment = true;
    this.loadingKeywordTrends = true;
    this.isError = false;

    const startDate = start.split('-').slice(0, 3).join('-');
    const endDate = end.split('-').slice(0, 3).join('-');
    this.fetchDashboardData(startDate, endDate);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  breadcrumbItems: MenuItem[] = [
    { label: "Social Media Analytics", routerLink: "/social-media/dashboard" },
    { label: "Platform Insights" }
  ];

  tabFacebook = { title: 'Facebook', img: 'assets/social-media/icons/facebook.png' };
  tabInstergram = { title: 'Instagram', img: 'assets/social-media/icons/instargram.png' };

  piPageItem1: PiPageItem = { title: '40+ new comments', totalComments: 47, commentsImprovement: -12, totalReactions: 560, reactionsImprovement: +28, HighlightedComments: 40 };
  piPageItem2: PiPageItem = { title: '40+ new comments', totalComments: 47, commentsImprovement: -12, totalReactions: 560, reactionsImprovement: +28, HighlightedComments: 40 };

  topBarCaption = "Custom Alerts";

}