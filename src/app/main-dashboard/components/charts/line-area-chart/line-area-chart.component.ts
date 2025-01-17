import { Component, Input, OnInit,EventEmitter, OnChanges, SimpleChanges,Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartsService } from '../../../services/charts.service';
import { timer } from 'rxjs';
import { DateRangeService } from '../../../services/shared-date-range/date-range.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../../auth/services/authentication.service';
import {MenuItem, MenuItemCommandEvent} from "primeng/api";

@Component({
  selector: 'app-line-area-chart',
  templateUrl: './line-area-chart.component.html',
  styleUrls: ['./line-area-chart.component.scss']
})
export class LineAreaChartComponent implements OnInit,OnChanges {
  @Output() sliderInteraction: EventEmitter<boolean> = new EventEmitter();
  @Output() deletedConfirmed: EventEmitter<void> = new EventEmitter<void>();
  @Output() hideConfirmed: EventEmitter<void> = new EventEmitter<void>();

  @Input() title!: string;
  @Output() changesEvent = new EventEmitter<boolean>();
  @Input() closable:boolean = true;

  data: any;
  options: any;

  @Input() dates!: any;
  @Input() positive!: any;
  @Input() negative!: any;
  @Input() neutral!: any;
  @Input() sources!: any;

  @Input() yAxis!:string;
  chartCategory:string='';
  selectedCategories:any[]=[];
  categories:string[]=['email','call','social'];

  cacheChange: boolean = false;

  dataset:any[]=[];

  processedCallLine: any[] = [];
  processedEmailLine: any[] = [];
  processedSocialLine: any[] = [];
  combinedLine: any;

  selectedDateRange: string[] | undefined;
  Date:any;

  @Input() changes:boolean=false;

  items: MenuItem[] = [];

  callWeigth:number=1;
  emailWeigth:number=1;
  socialWeigth:number=1;


  private socketSubscription: Subscription | undefined;


  constructor(private http: HttpClient, private chartService: ChartsService,private dateRangeService: DateRangeService,
    private authService:AuthenticationService
  ) {}

  ngOnInit() {
  
    if(this.yAxis==='sentiment-count'){
      this.chartCategory='Count';
    }
    else if(this.yAxis==='score'){
      this.chartCategory='Score';
    }
    else if(this.yAxis==='sources'){
      this.chartCategory='Separate';
    }
    this.items= [
      {
        icon: 'pi pi-ellipsis-v',
        items: [
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
              this['onDelete']();
            }
          },
          {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => {
              this['onEdit']();
            }
          },
          {
            label: 'Hide',
            icon: 'pi pi-eye-slash',
            command: () => {
              this['confirmDeleted']();
            }
          }

          
        ]
      }

  ];

    this.categories=this.sources;
    this.selectedCategories=this.sources;

        timer(0,1000).subscribe(() => {
          if(this.changes){
            if(this.chartCategory=='Count'){
              this.lineExtractCount(this.selectedCategories);
            }
            else if(this.chartCategory=='Score'){
                this.lineExtractSocre(this.selectedCategories);
            }
            else if(this.chartCategory=='Separate'){
              this.lineExtractSeparate(this.selectedCategories);
          }

              this.changes=false;
          }
        });
        
        this.dateRangeService.currentDateRange.subscribe(range => {
          if (range && range.length === 2 && range[0] && range[1]) {
            this.selectedDateRange = range.map(date => this.formatDate(date));

            this.Date = null;
            if(this.selectedCategories){
              if(this.chartCategory=='Count'){
                this.lineExtractCount(this.selectedCategories);
              }
              else if(this.chartCategory=='Score'){
                  this.lineExtractSocre(this.selectedCategories);
              }
              else if(this.chartCategory=='Separate'){
                this.lineExtractSeparate(this.selectedCategories);
            }
            }
          } else if(range && range.length === 2 && range[0]){
            this.selectedDateRange = undefined;
            this.Date = this.formatDate(range[0]);
            if(this.selectedCategories){
              if(this.chartCategory=='Count'){
                this.lineExtractCount(this.selectedCategories);
              }
              else if(this.chartCategory=='Score'){
                  this.lineExtractSocre(this.selectedCategories);
              }
              else if(this.chartCategory=='Separate'){
                this.lineExtractSeparate(this.selectedCategories);
            }
            }
          }
          else{
            if(this.selectedCategories){
              if(this.chartCategory=='Count'){
                this.lineExtractCount(this.selectedCategories);
              }
              else if(this.chartCategory=='Score'){
                  this.lineExtractSocre(this.selectedCategories);
              }
              else if(this.chartCategory=='Separate'){
                this.lineExtractSeparate(this.selectedCategories);
            }
              
            }
          }
        });

  }



  onSliderChange(event: any) {
    this.sliderInteraction.emit(true);
  }

  onDelete(){
    this.deletedConfirmed.emit();
  }

  
edit:boolean=false;

onEdit() {
    if((this.chartCategory=='Score' || this.chartCategory=='Separate') && this.categories.length > 1){
      this.sliderInteraction.emit(true);
      this.edit = true;
  }
  
}

editOffApply(){
  this.edit=false;
  this.sliderInteraction.emit(false);
  if(this.selectedCategories){
    if(this.chartCategory=='Score'){
        this.lineExtractSocre(this.selectedCategories);
    }
    if(this.chartCategory=='Separate'){
      this.lineExtractSeparate(this.selectedCategories);
  }
  }
}

editOffCancel(){
  this.sliderInteraction.emit(false);
  this.edit=false;
}


editOff(){
  this.sliderInteraction.emit(false);
  this.edit=false;
}

 confirmDeleted() {
        this.hideConfirmed.emit();
  }

  onSourceChange(category:any){
    if(this.chartCategory=='Score')
      {
        if(this.selectedCategories[0]!=null){
          this.lineExtractSocre(this.selectedCategories);
        }
        else{
          this.selectedCategories=this.sources;
          this.lineExtractSocre(this.selectedCategories);
        }

      }
      else if(this.chartCategory=='Count'){
        if(this.selectedCategories[0]!=null){
          this.lineExtractCount(this.selectedCategories);
        }
        else{
          this.selectedCategories=this.sources;
          this.lineExtractCount(this.selectedCategories);
        }
      }
      else if(this.chartCategory=='Separate'){
        if(this.selectedCategories[0]!=null){
          this.lineExtractSeparate(this.selectedCategories);
        }
        else{
          this.selectedCategories=this.sources;
          this.lineExtractSeparate(this.selectedCategories);
        }


    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['changes'] && changes['changes'].currentValue === true) {
      // Defer the method execution until after the view has been checked
      setTimeout(() => {
        this.chartDataGet();
        this.changesEvent.emit(false); // Reset the changes flag to false
      });
    }
  }

  chartDataGet(): void {
    this.authService.getIdToken().subscribe((token) =>{
    this.chartService.chartData(token).subscribe(
      (response) => {
        caches.open('all-data').then(cache => {
          cache.match('data').then((cachedResponse) => {
            if (cachedResponse) {
              cachedResponse.json().then((cachedData: any) => {
                // Compare the response with the cached data
                if (!this.isEqual(response, cachedData)) {
                  // Update only the changed data in the cache
                  // const updatedData = { ...cachedData, ...response };
                  const dataResponse = new Response(JSON.stringify(response), {
                    headers: { 'Content-Type': 'application/json' }
                  });
                  cache.put('data', dataResponse);
                  // this.DataCacheChange = true;
                }
              });
            } else {
              // Cache the response if no cached data exists
              const dataResponse = new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json' }
              });
              cache.put('data', dataResponse);
            }
          });
        });
        this.changes=true;
      },
      // (error) => {
      //   console.error('Error fetching doughnut chart data:', error);
      // }
    );
  });
  }

  isEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        return false;
      }
    }
    return true;
  }


  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    const formattedDate = date.toLocaleDateString('en-US', options);
    const parts = formattedDate.split(', ');

    // Format the date to remove the comma and ensure spacing
    const formattedDateString = `${parts[0]} ${parts[1]} ${parts[2]}`;
    return formattedDateString;
  }



  lineExtractCount(sources: string[]) {
    caches.open('all-data').then(cache => {
      cache.match('data').then(cachedResponse => {
        if (cachedResponse) {
          cachedResponse.json().then(data => {

            const dateRange = this.selectedDateRange;

            if (dateRange && dateRange.length === 2) {
              const startDate = new Date(dateRange[0]);
              const endDate = new Date(dateRange[1]);
              const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

              sources.forEach(source => {
                if (source === 'call') {
                  const callLine = data.map((item: any) => item.call);

                  this.processedCallLine = this.processLineDataCount(callLine[0]);

                }
                if (source === 'email') {
                  const emailLine = data.map((item: any) => item.email);
                  this.processedEmailLine = this.processLineDataCount(emailLine[0]);
                }
                if (source === 'social') {

                  const socialLine = data.map((item: any) => item.social);
                  this.processedSocialLine = this.processLineDataCount(socialLine[0]);

                }
              });

              if (diffDays > 90) {
                this.combinedLine = this.combineSentimentMonthData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
              } else {
                this.combinedLine = this.combineSentimentDayData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
              }
            } else{
              sources.forEach(source => {
                if (source === 'call') {
                  const callLine = data.map((item: any) => item.call);

                  this.processedCallLine = this.processLineDataCount(callLine[0]);
                }
                if (source === 'email') {
                  const emailLine = data.map((item: any) => item.email);
                  this.processedEmailLine = this.processLineDataCount(emailLine[0]);
                }
                if (source === 'social') {

                  const socialLine = data.map((item: any) => item.social);
                  this.processedSocialLine = this.processLineDataCount(socialLine[0]);

                }
              });

              this.combinedLine = this.combineSentimentDayData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
            }
          });
        // } else {
        //   console.log('Data not found in cache');
        }
      });
    });
  }


  lineExtractSocre(sources: string[]) {

    caches.open('all-data').then(cache => {
      cache.match('data').then(cachedResponse => {
        if (cachedResponse) {
          cachedResponse.json().then(data => {
            const dateRange = this.selectedDateRange;

            if (dateRange && dateRange.length === 2) {
              const startDate = new Date(dateRange[0]);
              const endDate = new Date(dateRange[1]);
              const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

              sources.forEach(source => {
                if (source === 'call') {
                  const callLine = data.map((item: any) => item.call);
                  this.processedCallLine = this.processLineDataScore(callLine[0]);
                }
                if (source === 'email') {
                  const emailLine = data.map((item: any) => item.email);
                  this.processedEmailLine = this.processLineDataScore(emailLine[0]);
                }
                if (source === 'social') {
                  const socialLine = data.map((item: any) => item.social);
                  this.processedSocialLine = this.processLineDataScore(socialLine[0]);
                }
              });

              if (diffDays > 90) {
                this.combinedLine = this.combineSentimentMonthData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
              } else {
                this.combinedLine = this.combineSentimentDayData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
              }
            } else if (this.Date) {
              sources.forEach(source => {
                if (source === 'call') {
                  const callLine = data.map((item: any) => item.call);
                  this.processedCallLine = this.processLineDataScore(callLine[0]);
                }
                if (source === 'email') {
                  const emailLine = data.map((item: any) => item.email);
                  this.processedEmailLine = this.processLineDataScore(emailLine[0]);
                }
                if (source === 'social') {
                  const socialLine = data.map((item: any) => item.social);
                  this.processedSocialLine = this.processLineDataScore(socialLine[0]);
                }
              });

              this.combinedLine = this.combineSentimentDayData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
            } else {
              sources.forEach(source => {
                if (source === 'email') {
                  const emailLine = data.map((item: any) => item.email);
                  this.processedEmailLine = this.processLineDataScore(emailLine[0]);
                }
              });
              this.combinedLine = this.combineSentimentMonthData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
            }
          });
        // } else {
        //   console.log('Data not found in cache');
        }
      });
    });
  }

  lineExtractSeparate(sources: string[]) {

    caches.open('all-data').then(cache => {
      cache.match('data').then(cachedResponse => {
        if (cachedResponse) {
          cachedResponse.json().then(data => {
            const dateRange = this.selectedDateRange;

            if (dateRange && dateRange.length === 2) {
              const startDate = new Date(dateRange[0]);
              const endDate = new Date(dateRange[1]);
              const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

              sources.forEach(source => {
                if (source === 'call') {
                  const callLine = data.map((item: any) => item.call);
                  this.processedCallLine = this.processLineDataScore(callLine[0]);

                }
                if (source === 'email') {
                  const emailLine = data.map((item: any) => item.email);
                  this.processedEmailLine = this.processLineDataScore(emailLine[0]);

                }
                if (source === 'social') {
                  const socialLine = data.map((item: any) => item.social);
                  this.processedSocialLine = this.processLineDataScore(socialLine[0]);
                }
              });

              if (diffDays > 90) {
                this.combinedLine = this.combineSentimentMonthData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
              } else {
                this.combinedLine = this.combineSentimentDayData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
              }
            } else{
              sources.forEach(source => {
                if (source === 'call') {
                  const callLine = data.map((item: any) => item.call);
                  this.processedCallLine = this.processLineDataScore(callLine[0]);
                }
                if (source === 'email') {
                  const emailLine = data.map((item: any) => item.email);
                  this.processedEmailLine = this.processLineDataScore(emailLine[0]);
                }
                if (source === 'social') {
                  const socialLine = data.map((item: any) => item.social);
                  this.processedSocialLine = this.processLineDataScore(socialLine[0]);
                }
              });

              this.combinedLine = this.combineSentimentDayData(this.processedCallLine, this.processedEmailLine, this.processedSocialLine, sources);
            }
          });}
        // } else {
        //   console.log('Data not found in cache');
        // }
      });
    });
  }

  processLineDataScore(lineData: any[]): any[] {
    const sentimentMap: { [key: string]: { positive: number, negative: number, neutral: number, positiveCount: number,negativeCount: number ,neutralCount: number,count:number,score:number} } = {};

    lineData.forEach((item: any) => {
      if (this.isDateInRange(item.Date)) {
        const date = item.Date;

        item.data.forEach((entry: any) => {
          const sentiment = entry.Sentiment;
          if (!sentimentMap[entry.time]) {
            sentimentMap[entry.time] = { positive: 0, negative: 0, neutral: 0, count: 0 ,positiveCount: 0,negativeCount: 0 ,neutralCount: 0,score:0};
          }

          if (sentiment && sentiment.Positive) {
            sentimentMap[entry.time].score += sentiment.Positive;
            sentimentMap[entry.time].positiveCount += 1;
          }
          if (sentiment && sentiment.Negative) {
            sentimentMap[entry.time].score += sentiment.Negative;
            sentimentMap[entry.time].negativeCount += 1;
          }
          if (sentiment && sentiment.Neutral) {
            sentimentMap[entry.time].score += sentiment.Neutral;
            sentimentMap[entry.time].neutralCount += 1;
          }
          sentimentMap[entry.time].count += 1;
        });
      }
    });



    return Object.keys(sentimentMap).map(date => {
      const avgSentiments = sentimentMap[date];
      return {
        Date: date,
        score: avgSentiments.score !== 0 ? Math.round((avgSentiments.score / avgSentiments.count) * 100) / 100 : 0,
      };
    });
  }

  processLineDataCount(lineData: any[]): any[] {
    const sentimentMap: { [key: string]: { positive: number, negative: number, neutral: number, positiveCount: number, negativeCount: number, neutralCount: number, count: number } } = {};

    lineData.forEach((item: any) => {

      if (this.isDateInRange(item.Date)) {
        const date = item.Date;

        item.data.forEach((entry: any) => {
          const sentiment = entry.Sentiment;

          if (!sentimentMap[date]) {
            sentimentMap[date] = {
              positive: 0,
              negative: 0,
              neutral: 0,
              positiveCount: 0,
              negativeCount: 0,
              neutralCount: 0,
              count: 0
            };
          }

          // Check if sentiment is defined before accessing its properties
          if (sentiment && sentiment.Positive !== undefined) {
            sentimentMap[date].positive += sentiment.Positive;
            sentimentMap[date].positiveCount += 1;
          }
          if (sentiment && sentiment.Negative !== undefined) {
            sentimentMap[date].negative += sentiment.Negative;
            sentimentMap[date].negativeCount += 1;
          }
          if (sentiment && sentiment.Neutral !== undefined) {
            sentimentMap[date].neutral += sentiment.Neutral;
            sentimentMap[date].neutralCount += 1;
          }

          sentimentMap[date].count += 1;
        });
      }
    });


    // return Object.keys(sentimentMap).map(date => {
    //   const avgSentiments = sentimentMap[date];
    //   return {
    //     Date: date,
    //     positive: avgSentiments.positiveCount !== 0 ? Math.round((avgSentiments.positive / avgSentiments.positiveCount) * 100) / 100 : 0,
    //     negative: avgSentiments.negativeCount !== 0 ? Math.round((avgSentiments.negative / avgSentiments.negativeCount) * 100) / 100 : 0,
    //     neutral: avgSentiments.neutralCount !== 0 ? Math.round((avgSentiments.neutral / avgSentiments.neutralCount) * 100) / 100 : 0,
    //   };
    // });
    return Object.keys(sentimentMap).map(date => {
      const avgSentiments = sentimentMap[date];
      return {
        Date: date,
        positive: avgSentiments.positiveCount,
        negative: avgSentiments.negativeCount ,
        neutral: avgSentiments.neutralCount ,
      };
    });
  }



  isDateInRange(dateStr: string): boolean {
    if(this.selectedDateRange && this.selectedDateRange.length === 2 && this.selectedDateRange[0] && this.selectedDateRange[1])
      {
        if (!this.selectedDateRange || this.selectedDateRange.length !== 2) {
          return false;
        }
        const date = new Date(dateStr);
        const startDate = new Date(this.selectedDateRange[0]);
        const endDate = new Date(this.selectedDateRange[1]);
        return date >= startDate && date <= endDate;
      }
    else if(this.Date){
      const date = new Date(dateStr);
      const currentDate = new Date(this.Date);
      return date >= currentDate && date <= currentDate;
    }
    else if(!this.selectedDateRange)
      {
        return true;
      }
    return false;
  }

  combineSentimentMonthData(callData: any[], emailData: any[], socialData: any[], sources: string[]) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const combinedDataMap: { [key: string]: any } = {};

    if (this.chartCategory === 'Count') {
      const processData = (dataArray: any[]) => {
        dataArray.forEach(data => {
          const date = new Date(data.Date);
          const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
          if (!combinedDataMap[monthYear]) {
            combinedDataMap[monthYear] = {
              Date: date,  // Store the actual Date object for sorting
              monthYear: monthYear,
              positive: 0,
              negative: 0,
              neutral: 0,
              positiveCount: 0,
              negativeCount: 0,
              neutralCount: 0
            };
          }
          combinedDataMap[monthYear].positive += data.positive;
          combinedDataMap[monthYear].negative += data.negative;
          combinedDataMap[monthYear].neutral += data.neutral;
          combinedDataMap[monthYear].positiveCount += 1;
          combinedDataMap[monthYear].negativeCount += 1;
          combinedDataMap[monthYear].neutralCount += 1;
        });
      };
    
      sources.forEach(source => {
        if (source === 'call') {
          processData(callData);
        }
        if (source === 'email') {
          processData(emailData);
        }
        if (source === 'social') {
          processData(socialData);
        }
      });
    
      // Sort combined data by Date
      const sortedCombinedData = Object.values(combinedDataMap).sort((a: any, b: any) => a.Date - b.Date);
    
      this.dates = sortedCombinedData.map((entry: any) => entry.monthYear);
    
      // Calculate average sentiment scores
      sortedCombinedData.forEach((entry: any) => {
        entry.avgPositive = entry.positive ;
        entry.avgNegative = entry.negative ;
        entry.avgNeutral = entry.neutral ;
      });
    
      this.positive = sortedCombinedData.map((entry: any) => entry.avgPositive);
      this.negative = sortedCombinedData.map((entry: any) => entry.avgNegative);
      this.neutral = sortedCombinedData.map((entry: any) => entry.avgNeutral);
    
      const documentStyle = getComputedStyle(document.documentElement);
    
      this.dataset = [
        {
          label: 'Positive',
          data: this.positive,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          tension: 0.4,
          backgroundColor: 'rgba(60,180,16,0.2)'
        },
        {
          label: 'Negative',
          data: this.negative,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--red-500'),
          tension: 0.4,
          backgroundColor: 'rgba(152,37,40,0.2)'
        },
        {
          label: 'Neutral',
          data: this.neutral,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--yellow-500'),
          tension: 0.4,
          backgroundColor: 'rgba(255,167,38,0.2)'
        }
      ];
    
      this.lineChartShow();
    }
    if (this.chartCategory === 'Score') {

  const processData = (dataArray: any[], weight: number) => {
    dataArray.forEach(data => {
      const date = new Date(data.Date);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!combinedDataMap[monthYear]) {
        combinedDataMap[monthYear] = {
          Date: date,  // Store the actual Date object for sorting
          monthYear: monthYear,
          totalWeightedScore: 0,
          totalWeight: 0,
        };
      }
      combinedDataMap[monthYear].totalWeightedScore += data.score * weight;
      combinedDataMap[monthYear].totalWeight += weight;
    });
  };

  sources.forEach(source => {
    if (source === 'call') {
      processData(callData, this.callWeigth);
    }
    if (source === 'email') {
      processData(emailData, this.emailWeigth);
    }
    if (source === 'social') {
      processData(socialData, this.socialWeigth);
    }
  });

  // Sort combined data by Date
  const sortedCombinedData = Object.values(combinedDataMap).sort((a: any, b: any) => a.Date - b.Date);

  this.dates = sortedCombinedData.map((entry: any) => entry.monthYear);
  const documentStyle = getComputedStyle(document.documentElement);

  // Calculate average weighted score
  sortedCombinedData.forEach((entry: any) => {
    entry.avgScore = entry.totalWeightedScore / entry.totalWeight;
  });

  this.dataset = [
    {
      label: 'Average Weighted Score',
      data: sortedCombinedData.map((entry: any) => entry.avgScore),
      fill: true,
      borderColor: documentStyle.getPropertyValue('--green-500'),
      tension: 0.4,
      backgroundColor: 'rgba(60,180,16,0.2)',
    },
  ];

  this.lineChartShow();
}
    else if (this.chartCategory === 'Separate') {

      const documentStyle = getComputedStyle(document.documentElement);
  this.dataset = [];

  const allUniqueDates = new Set<string>();

  const processData = (dataArray: any[], weight: number) => {
    const combined: { [key: string]: any } = {};
    dataArray.forEach(data => {
      const date = new Date(data.Date);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!combined[monthYear]) {
        combined[monthYear] = {
          Date: date.toISOString(),  // Use ISO string for consistent formatting
          monthYear: monthYear,
          score: 0,
          count: 0,
        };
      }
      // Apply weight to the score calculation
      combined[monthYear].score += data.score * weight;
      combined[monthYear].count += 1;

      allUniqueDates.add(monthYear); // Add to unique dates set
    });
    return combined;
  };

  sources.forEach(source => {
    let finalData: any = {};
    if (source === 'call') {
      finalData = processData(callData, this.callWeigth);
      this.dataset.push({
        label: 'Call',
        data: finalData,
        fill: true,
        borderColor: documentStyle.getPropertyValue('--green-500'),
        tension: 0.4,
        backgroundColor: 'rgba(60,180,16,0.2)'
      });
    }
    if (source === 'email') {
      finalData = processData(emailData, this.emailWeigth);
      this.dataset.push({
        label: 'Email',
        data: finalData,
        fill: true,
        borderColor: documentStyle.getPropertyValue('--red-500'),
        tension: 0.4,
        backgroundColor: 'rgba(152,37,40,0.2)'
      });
    }
    if (source === 'social') {
      finalData = processData(socialData, this.socialWeigth);
      this.dataset.push({
        label: 'Social Media',
        data: finalData,
        fill: true,
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        tension: 0.4,
        backgroundColor: 'rgba(60,180,16,0.2)'
      });
    }
  });

  const sortedDates = Array.from(allUniqueDates).sort((a, b) => new Date(a as string).getTime() - new Date(b as string).getTime());

  this.dataset = this.dataset.map(dataset => {
    const filledData = sortedDates.map(date => {
      if (dataset.data[date]) {
        return dataset.data[date].score / dataset.data[date].count;
      } else {
        return 0;
      }
    });
    return { ...dataset, data: filledData };
  });

  this.dates = sortedDates;
  this.lineChartShow();
}
    
    
    


  }

  combineSentimentDayData(callData: any[], emailData: any[], socialData: any[], sources: string[]) {
    const combinedDataMap: { [key: string]: any } = {};
    const allUniqueDates = new Set<string>();

    if (this.chartCategory === 'Count') {
        const processData = (dataArray: any[]) => {
            dataArray.forEach(data => {
                const date = new Date(data.Date);
                const dayMonthYear = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; // Format: YYYY-MM-DD

                if (!combinedDataMap[dayMonthYear]) {
                    combinedDataMap[dayMonthYear] = {
                        Date: dayMonthYear,
                        positive: 0,
                        negative: 0,
                        neutral: 0,
                        positiveCount: 0,
                        negativeCount: 0,
                        neutralCount: 0
                    };
                }
                combinedDataMap[dayMonthYear].positive += data.positive;
                combinedDataMap[dayMonthYear].negative += data.negative;
                combinedDataMap[dayMonthYear].neutral += data.neutral;
                combinedDataMap[dayMonthYear].positiveCount += 1;
                combinedDataMap[dayMonthYear].negativeCount += 1;
                combinedDataMap[dayMonthYear].neutralCount += 1;
            });
        };

        sources.forEach(source => {
            if (source === 'call') {
                processData(callData);
            }
            if (source === 'email') {
                processData(emailData);
            }
            if (source === 'social') {
                processData(socialData);
            }
        });

        this.dates = Object.values(combinedDataMap).map((entry: any) => entry.Date);

        // Calculate average sentiment scores
        Object.values(combinedDataMap).forEach((entry: any) => {
            entry.avgPositive = entry.positive / entry.positiveCount;
            entry.avgNegative = entry.negative / entry.negativeCount;
            entry.avgNeutral = entry.neutral / entry.neutralCount;
        });

        this.positive = Object.values(combinedDataMap).map((entry: any) => entry.avgPositive);
        this.negative = Object.values(combinedDataMap).map((entry: any) => entry.avgNegative);
        this.neutral = Object.values(combinedDataMap).map((entry: any) => entry.avgNeutral);

        const documentStyle = getComputedStyle(document.documentElement);

        this.dataset = [
            {
                label: 'Positive',
                data: this.positive,
                fill: true,
                borderColor: documentStyle.getPropertyValue('--green-500'),
                tension: 0.4,
                backgroundColor: 'rgba(60,180,16,0.2)'
            },
            {
                label: 'Negative',
                data: this.negative,
                fill: true,
                borderColor: documentStyle.getPropertyValue('--red-500'),
                tension: 0.4,
                backgroundColor: 'rgba(152,37,40,0.2)'
            },
            {
                label: 'Neutral',
                data: this.neutral,
                fill: true,
                borderColor: documentStyle.getPropertyValue('--yellow-500'),
                tension: 0.4,
                backgroundColor: 'rgba(255,167,38,0.2)'
            }
        ];

        this.lineChartShow();
    } else if (this.chartCategory === 'Score') {
      const processData = (dataArray: any[], weight: number) => {
        dataArray.forEach(data => {
          const date = new Date(data.Date);
          const dayMonth = `${date.getMonth() + 1}-${date.getDate()}`; // Format: MM-DD
    
          if (!combinedDataMap[dayMonth]) {
            combinedDataMap[dayMonth] = {
              Date: dayMonth,
              totalWeightedScore: 0,
              totalWeight: 0,
            };
          }
          combinedDataMap[dayMonth].totalWeightedScore += data.score * weight;
          combinedDataMap[dayMonth].totalWeight += weight;
        });
      };
    
      sources.forEach(source => {
        if (source === 'call') {
          processData(callData, this.callWeigth);
        }
        if (source === 'email') {
          processData(emailData, this.emailWeigth);
        }
        if (source === 'social') {
          processData(socialData, this.socialWeigth);
        }
      });
    
      const documentStyle = getComputedStyle(document.documentElement);
    
      // Calculate average weighted score
      Object.values(combinedDataMap).forEach((entry: any) => {
        entry.avgScore = entry.totalWeightedScore / entry.totalWeight;
      });
    
      this.dates = Object.values(combinedDataMap).map((entry: any) => entry.Date);
      this.dataset = [
        {
          label: 'Average Weighted Score',
          data: Object.values(combinedDataMap).map((entry: any) => entry.avgScore),
          fill: true,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          tension: 0.4,
          backgroundColor: 'rgba(60,180,16,0.2)',
        },
      ];
    
      this.lineChartShow();
    } else if (this.chartCategory === 'Separate') {
      const documentStyle = getComputedStyle(document.documentElement);
      this.dataset = [];
    
      const processData = (dataArray: any[], weight: number) => {
        const combined: { [key: string]: any } = {};
        dataArray.forEach(data => {
          const date = new Date(data.Date);
          const dayMonth = `${date.getMonth() + 1}-${date.getDate()}`; // Format: MM-DD
    
          if (!combinedDataMap[dayMonth]) {
            combinedDataMap[dayMonth] = {
              Date: dayMonth,
              totalWeightedScore: 0,
              totalWeight: 0,
            };
          }
          combinedDataMap[dayMonth].totalWeightedScore += data.score * weight;
          combinedDataMap[dayMonth].totalWeight += weight;
    
          if (!combined[dayMonth]) {
            combined[dayMonth] = {
              Date: dayMonth,
              totalWeightedScore: 0,
              totalWeight: 0,
            };
          }
          combined[dayMonth].totalWeightedScore += data.score * weight;
          combined[dayMonth].totalWeight += weight;
        });
        return combined;
      };
    
      const allUniqueDates = new Set<string>();
    
      sources.forEach(source => {
        let finalData: any = {};
        let weight: number;
        if (source === 'call') {
          weight = this.callWeigth;
          finalData = processData(callData, weight);
          Object.keys(finalData).forEach(date => allUniqueDates.add(date));
          this.dataset.push({
            label: 'Call',
            data: finalData,
            fill: true,
            borderColor: documentStyle.getPropertyValue('--green-500'),
            tension: 0.4,
            backgroundColor: 'rgba(60,180,16,0.2)'
          });
        }
        if (source === 'email') {
          weight = this.emailWeigth;
          finalData = processData(emailData, weight);
          Object.keys(finalData).forEach(date => allUniqueDates.add(date));
          this.dataset.push({
            label: 'Email',
            data: finalData,
            fill: true,
            borderColor: documentStyle.getPropertyValue('--red-500'),
            tension: 0.4,
            backgroundColor: 'rgba(60,180,16,0.2)'
          });
        }
        if (source === 'social') {
          weight = this.socialWeigth;
          finalData = processData(socialData, weight);
          Object.keys(finalData).forEach(date => allUniqueDates.add(date));
          this.dataset.push({
            label: 'Social Media',
            data: finalData,
            fill: true,
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            tension: 0.4,
            backgroundColor: 'rgba(60,180,16,0.2)'
          });
        }
      });
    
      // Convert the set of unique dates to a sorted array
      const sortedDates = Array.from(allUniqueDates).sort((a, b) => {
        const [monthA, dayA] = a.split('-').map(Number);
        const [monthB, dayB] = b.split('-').map(Number);
        return new Date(2020, monthA - 1, dayA).getTime() - new Date(2020, monthB - 1, dayB).getTime();
      });
    
      // Calculate averages and fill missing dates with zeros for each dataset
      this.dataset = this.dataset.map(dataset => {
        const filledData = sortedDates.map(date => {
          if (dataset.data[date]) {
            return dataset.data[date].totalWeightedScore / dataset.data[date].totalWeight;
          } else {
            return 0;
          }
        });
        return { ...dataset, data: filledData };
      });
    
      // Set dates for the chart
      this.dates = sortedDates;
    
      // Function to show the chart
      this.lineChartShow();
    }
}




  lineChartShow() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: this.dates,
      datasets: this.dataset
    };


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
