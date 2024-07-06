import {Component, OnInit} from '@angular/core';
import {EChartsOption} from "echarts";
import {DashboardApiService} from "../../../services/dashboard-api.service";

@Component({
  selector: 'app-gauge-chart-facebook',
  templateUrl: './gauge-chart-facebook.component.html',
  styleUrl: './gauge-chart-facebook.component.scss'
})
export class GaugeChartFacebookComponent implements OnInit {

  options!: EChartsOption;
  score!: number;

  constructor(private getfacebookscore: DashboardApiService) {}

  ngOnInit(): void {
    this.initializeChart();
    const startDate = '2024-05-01';
    const endDate = '2024-08-01';
    this.updateGaugeChart(startDate, endDate);
  }

  initializeChart(): void {
    this.options = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '65%'],
          radius: '90%',
          min: 0,
          max: 1,
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.35, '#FF6E76'],
                [0.65, '#e7cb59'],
                [1, '#5dd28d'],
              ]
            }
          },
          axisTick: {
            show: false
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '50%',
            width: 10,
            offsetCenter: [0, '-15%'],
            itemStyle: {
              color: 'black'
            }
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false,
            fontSize: 50,
            offsetCenter: [0, '-10%'],
            valueAnimation: true,
            color: 'inherit',
          },
          data: [
            {
              value: 4
            }
          ]
        }
      ]
    };
  }

  updateGaugeChart(startDate: string, endDate: string): void {
    this.getfacebookscore.getSentimentScoreFacebook(startDate, endDate).subscribe(
      (data: number) => {
        this.score = data;
        console.log(data)
        if (this.options.series && Array.isArray(this.options.series) && this.options.series.length > 0) {
          const firstSeries = this.options.series[0];
          if ('data' in firstSeries && Array.isArray(firstSeries.data) && firstSeries.data.length > 0) {
            firstSeries.data[0].value = (data+1)/2;

            // Trigger change detection if using ngx-echarts
            this.options = { ...this.options };
          }
        }
      },
      (error) => {
        console.error('Error fetching sentiment score', error);
      }
    );
  }
}
