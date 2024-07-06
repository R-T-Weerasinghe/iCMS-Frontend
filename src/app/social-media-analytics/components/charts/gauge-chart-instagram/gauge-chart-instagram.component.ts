import { Component } from '@angular/core';
import {EChartsOption} from "echarts";
import { DashboardApiService } from '../../../services/dashboard-api.service';


@Component({
  selector: 'app-gauge-chart-instagram',
  templateUrl: './gauge-chart-instagram.component.html',
  styleUrl: './gauge-chart-instagram.component.scss'
})
export class GaugeChartInstagramComponent {

  options!: EChartsOption;
  score!: number;

  constructor(private getinstagramscore: DashboardApiService) {}

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
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.15, '#db0b0b'],
                [0.65, '#ffdc28'],
                [1, '#44c022'],
              ]
            }
          },
          axisTick: {
            show: false
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '50%',
            width: 20,
            offsetCenter: [0, '-15%'],
            itemStyle: {
              color: 'auto'
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
    this.getinstagramscore.getSentimentScoreInstagram(startDate, endDate).subscribe(
      (data: number) => {
        this.score = data;
        console.log(data)
        if (this.options.series && Array.isArray(this.options.series) && this.options.series.length > 0) {
          const firstSeries = this.options.series[0];
          if ('data' in firstSeries && Array.isArray(firstSeries.data) && firstSeries.data.length > 0) {
            firstSeries.data[0].value = data;

            // Trigger change detection if using ngx-echarts
            this.options = { ...this.options };
          }
        }
      },
      (error: any) => {
        console.error('Error fetching sentiment score', error);
      }
    );
  }
 
}
