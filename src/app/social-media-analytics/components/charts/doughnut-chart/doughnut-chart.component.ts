import { Component, Input, OnInit } from '@angular/core';
import { DashboardApiService } from '../../../services/dashboard-api.service';

@Component({
  selector: 'doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.scss'
})

export class DoughnutChartComponent implements OnInit {
  @Input() title!: string;
  @Input() percentages!: number[];
  data: any;

  options: any;
  

  constructor(private DashboardAPiService:DashboardApiService){}

  ngOnInit() {
    const startDate = '2024-05-01';
    const endDate = '2024-07-30';

    this.fetchSentimentPercentages(startDate,endDate);
  }

  fetchSentimentPercentages(startDate:string,endDate:string) {
    this.DashboardAPiService.getSentimentPercentage(startDate,endDate)
      .subscribe(
        (data: any) => {
          this.percentages = data.percentage; // Update percentages with data from backend

          // Update chart data and options
          this.data = {
            labels: ['Negative', 'Neutral', 'Positive'],
            datasets: [
              {
                data: this.percentages,
                backgroundColor: [
                  '#FF6E76',
                  '#e7cb59',
                  '#5dd28d'
                ],
                hoverBackgroundColor: [
                  '#f87171',
                  '#facc15',
                  '#4ade80'
                ]
              }
            ]
          };

          this.options = {
            cutout: '50%',
            height: 800,
            overrides: {
              legend: {
                padding: 200
              }
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  color: '--text-color'
                },
              }
            }
          };
        },
        (error) => {
          console.error('Error fetching sentiment percentages:', error);
        }
      );
  }
}

