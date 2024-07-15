import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
@Component({
  selector: 'app-dashboard-time-graph',
  templateUrl: './dashboard-time-graph.component.html',
  styleUrl: './dashboard-time-graph.component.scss'
})
export class DashboardTimeGraphComponent implements OnInit {

  dialogVisible: boolean = false;
  data: any;
  options: any;

  testData: any;
  testOptions: any;

  @Input() intervalInDaysStart!: number;
  @Input() intervalInDaysEnd!: number;
  @Input() firstResponseTimes!: number[];
  @Input() overdueCount!: number;
  @Input() avgFRT!: number;
  @Input() clientMsgTimes!: string[];
  displayedAvgFRT: string = '';

  constructor (private utilityService: UtilityService) {}

  ngOnInit() {
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['emailCount'] || changes['firstResponseTime'] || changes['overdueCount'] || changes['avgFRT']) {
      this.updateData();
    }
  }

  popup() {
    this.dialogVisible = true;
  }

  updateData() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      
      this.displayedAvgFRT = this.utilityService.convertMinutes(this.avgFRT);
      const combinedData = this.clientMsgTimes.map((x, index) => ({
        x: new Date(x), // Convert to Date object
        y: this.firstResponseTimes[index]
      }));
      this.testData = {
        datasets: [
            {
                label: 'First Response Time',
                data: combinedData.sort((a, b) => a.x.getTime() - b.x.getTime()),
                borderColor: '#42A5F5',
                fill: false,
                tension: 0.4,
            }
        ]
      }
      this.testOptions = {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
              tooltipFormat: 'll HH:mm',
              displayFormats: {
                hour: 'MMM D, HH:mm'
              }
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'FRT'
            },
            ticks: {
                callback: function(value: number) {
                    if (value <= 0) return '0m';
                    if (value < 60) {
                      return `${value}m`;
                    } else {
                      const hours = Math.floor(value / 60);
                      const minutes = value % 60;
                      return `${hours}h ${minutes}m`;
                    }
                }
            },
          }
        }
      }


      this.data = {
          datasets: [
            //   {
            //       label: 'Email count',
            //       fill: false,
            //       borderColor: documentStyle.getPropertyValue('--blue-500'),
            //       backgroundColor: "rgba(0, 100, 250, 0.4)",
            //       yAxisID: 'y',
            //       tension: 0.4,
            //       data: this.emailCount,
            //   },
              {
                  label: 'First Response Time',
                  fill: true,
                  borderColor: documentStyle.getPropertyValue('--green-500'),
                  backgroundColor: "rgba(0, 200, 100, 0.2)",
                  yAxisID: 'y',
                  tension: 0.4,
                  data: combinedData.sort((a, b) => a.x.getTime() - b.x.getTime()),
              }
          ]
      };
      
      this.options = {
          stacked: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      usePointStyle: true,
                      color: textColor,
                  },
                  position: "bottom",
              },
              title: {
                display: true,
                color: textColor,
                text: 'First Response Time',
                font: {
                    size: 14,
                },	
              }
          },
          scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour',
                  tooltipFormat: 'll HH:mm',
                  displayFormats: {
                    hour: 'MMM D, HH:mm'
                  }
                },
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  }
              },
              y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                      color: surfaceBorder
                  },
                  ticks: {
                    color: textColorSecondary,
                    callback: function(value: number) {
                        if (value <= 0) return '0m';
                        if (value < 60) {
                          return `${value}m`;
                        } else {
                          const hours = Math.floor(value / 60);
                          const minutes = value % 60;
                          return `${hours}h ${minutes}m`;
                        }
                    },
                  },
            },
              y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      drawOnChartArea: false,
                      color: surfaceBorder
                  }
              }
          }
      };
  }
}
