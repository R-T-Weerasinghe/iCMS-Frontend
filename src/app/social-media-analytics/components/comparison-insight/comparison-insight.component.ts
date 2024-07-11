import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

interface ComparisonInsight {
  product: string;
  percentage: string;
  isUpTrend: boolean;
}

@Component({
  selector: 'app-comparison-insight',
  templateUrl: './comparison-insight.component.html',
  styleUrls: ['./comparison-insight.component.scss']
})
export class ComparisonInsightComponent implements OnChanges {
  insights: ComparisonInsight[] = [];
  @Input() data: any[] = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.insights = this.data;
    }
  }

  // ngOnInit() {
  //   this.insights = [
  //     { product: 'Vertex AI', percentage: '1.02%', isUpTrend: true },
  //     { product: 'AWS SageMaker', percentage: '1.50%', isUpTrend: true },
  //     { product: 'Azure ML', percentage: '0.85%', isUpTrend: false },
  //     { product: 'TensorFlow', percentage: '2.00%', isUpTrend: true },
  //     { product: 'PyTorch', percentage: '1.75%', isUpTrend: true },
  //     { product: 'IBM Watson', percentage: '0.95%', isUpTrend: false },
  //     { product: 'H2O.ai', percentage: '0.60%', isUpTrend: false },
  //     { product: 'DataRobot', percentage: '1.20%', isUpTrend: true },
  //     { product: 'BigML', percentage: '0.70%', isUpTrend: false },
  //     { product: 'RapidMiner', percentage: '0.80%', isUpTrend: false }
  //   ];
  // }

  getArrowSymbol(isUpTrend: boolean): string {
    return isUpTrend ? '\u2191' : '\u2193';
  }

  getTrendStatus(isUpTrend: boolean): string {
    return isUpTrend ? 'UpTrending' : 'DownTrending';
  }
}
