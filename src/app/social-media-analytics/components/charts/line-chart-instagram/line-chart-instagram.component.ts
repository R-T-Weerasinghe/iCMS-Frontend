import { Component,Input} from '@angular/core';
import { DashboardApiService } from '../../../services/dashboard-api.service';

@Component({
  selector: 'line-chart-instagram',
  templateUrl: './line-chart-instagram.component.html',
  styleUrl: './line-chart-instagram.component.scss'
})
export class LineChartInstagramComponent {
  @Input() title!: string;
  data: any;

  options: any;

  constructor(private instagramdataAPiservice:DashboardApiService){}

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const startDate = '2024-05-01';
    const endDate = '2024-07-01';

    this.instagramdataAPiservice.getInstagramAnalysisData(startDate, endDate)
      .subscribe(
        (data: any) => {
          console.log(data);

          const convertDateFormat = (dateString: string): string => {
            const date = new Date(dateString);
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
            const day = date.getDate().toString().padStart(2, '0');
            return `${month}-${day}`;
          };

          const labels = Object.keys(data['1']).map(dateString => convertDateFormat(dateString));

          this.data = {
            labels: labels,
            datasets: [
              {
                label: 'Reacts',
                data: Object.values(data['1']),
                borderColor: 'rgb(255, 220, 128)',
              },
              {
                label: 'Comments',
                data: Object.values(data['2']),
                borderColor:'rgb(193, 53, 132)' ,
              },
            ]
          };
        },
        error => {
          console.error('Error fetching Facebook Analysis Data:', error);
          // Handle error (e.g., show error message in UI)
        }
      );
   
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 1.1,
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
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }


}
