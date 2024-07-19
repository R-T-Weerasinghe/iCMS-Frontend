import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from "primeng/api";
import { CallAnalyticsService } from "../../services/call-analytics.service";
import {
  BestOperatorItem,
  CallStatistics,
  OperatorAnalyticsOverTimeRecord,
  SentimentOverTimeDataSet,
  SentimentPercentages
} from "../../types";
import { WordCloudItem } from "../../../shared/types";
import { DoughnutChartComponent } from "../doughnut-chart/doughnut-chart.component";
import { LineAreaChartComponent } from "../line-area-chart/line-area-chart.component";
import { BarChartComponent } from "../horizontal-bar-chart/bar-chart.component";
import { StackedBarChartComponent } from "../stacked-bar-chart/stacked-bar-chart.component";
import { WordcloudComponent } from "../../../shared/shared-components/wordcloud/wordcloud.component";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild('dChartComp') dChart!: DoughnutChartComponent;
  @ViewChild('lChartComp') lChart!: LineAreaChartComponent;
  @ViewChild('bChartComp') bChart!: BarChartComponent;
  @ViewChild('sChartComp') sChart!: StackedBarChartComponent;
  @ViewChild('keywordCloud') keywordCloud!: WordcloudComponent;

  breadcrumbItems: MenuItem[] = [
    { label: "Call Analytics" },
    { label: "Dashboard" }
  ];

  start = this.formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1)), "start");
  end = this.formatDate(new Date(), "end");
  isLoadingStatistics = true;
  isLoadingPercentages = true;
  isLoadingSentimentsOverTime = true;
  isLoadingTopics = true;
  isLoadingOperatorCalls = true;
  isLoadingOperatorRankings = true;
  isLoadingKeywords = true;
  callStatistics!: CallStatistics;
  callSentiments!: SentimentPercentages;
  sentimentOverTime!: SentimentOverTimeDataSet[];
  operatorCallsOverTime!: OperatorAnalyticsOverTimeRecord[];
  operatorRankings!: BestOperatorItem[];
  topicDistribution!: { [KeyFilter: string]: number }
  keywords: WordCloudItem[] = []
  protected readonly Math = Math;
  protected readonly parseInt = parseInt;
  protected readonly parseFloat = parseFloat;

  constructor(private callAnalyticsService: CallAnalyticsService, private cdr: ChangeDetectorRef) {
    this.callAnalyticsService.getAllKeywords(this.start, this.end).then(response => {
      this.keywords = Object.entries(response.data).map(([word, weight]) => (
        { word: word, weight: Number(weight) }));
      if (this.keywordCloud) this.keywordCloud.refreshChart(this.keywords);
      this.isLoadingKeywords = false;
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });
  }

  ngOnInit() {
    this.end = this.formatDate(new Date(), "end");
    this.start = this.formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1)), "start");
    this.reloadData(this.start, this.end);
  }

  formatDate(date: Date, type: "start" | "end" = "start"): string {
    const pad = (num: any) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // getMonth() is zero-indexed
    const day = pad(date.getDate());
    if (type === "start") {
      return `${year}-${month}-${day}-00-00-00`;
    } else {
      return `${year}-${month}-${day}-23-59-59`;
    }
  }

  reloadData(start: string, end: string) {
    this.callAnalyticsService.getCallStatistics(start, end).then(response => {
      this.callStatistics = response.data;
      this.isLoadingStatistics = false;
      console.log(this.callStatistics);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });

    this.callAnalyticsService.getSentimentPercentages(start, end).then(response => {
      this.callSentiments = response.data
      console.log(this.callSentiments)
      if (this.dChart) this.dChart.refreshChart(response.data);
      this.isLoadingPercentages = false;
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });

    this.callAnalyticsService.getSentimentOverTime(start, end).then(response => {
      this.sentimentOverTime = response.data;
      if (this.lChart) this.lChart.refreshChart(response.data);
      this.isLoadingSentimentsOverTime = false;
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });

    this.callAnalyticsService.getTopicsDistribution(start, end).then(response => {
      this.topicDistribution = response.data;
      if (this.bChart) this.bChart.refreshChart(response.data);
      this.isLoadingTopics = false;
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });

    this.callAnalyticsService.getOperatorCallsOverTime(start, end).then(response => {
      this.operatorCallsOverTime = response.data;
      if (this.sChart) this.sChart.refreshChart(response.data);
      this.isLoadingOperatorCalls = false;
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });

    this.callAnalyticsService.getOperatorRatings(start, end).then(response => {
      this.operatorRankings = response.data;
      this.isLoadingOperatorRankings = false;
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });

    this.callAnalyticsService.getAllKeywords(start, end).then(response => {
      this.keywords = Object.entries(response.data).map(([word, weight]) => ({ word: word, weight: Number(weight) }));
      if (this.keywordCloud) this.keywordCloud.refreshChart(this.keywords);
      this.isLoadingKeywords = false;
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });
  }
}
