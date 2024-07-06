import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.scss'
})

export class DoughnutChartComponent implements OnChanges {
  @Input() title!: string;
  @Input() percentages: number[] = [];
  data: any;
  valuePercentage!: number[];
  options: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['percentages']) {
      this.valuePercentage = this.percentages;
    }
    
    this.data = {
      labels: ['Negative', 'Neutral', 'Positive'],
      datasets: [
        {
          data: this.valuePercentage,
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
  }

}

