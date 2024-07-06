import { Component, OnInit } from '@angular/core';

interface ComparisonInsight {
  title: string;
  percentage: string;
  name: string;
  isUpTrend: boolean;
}

@Component({
  selector: 'app-comparison-insight',
  templateUrl: './comparison-insight.component.html',
  styleUrls: ['./comparison-insight.component.scss']
})
export class ComparisonInsightComponent implements OnInit {
  insights: ComparisonInsight[] = [];

  ngOnInit() {
    this.insights = [
      { title: 'Vertex AI', percentage: '1.02%', name: 'Google', isUpTrend: true },
      { title: 'AWS SageMaker', percentage: '1.50%', name: 'Amazon', isUpTrend: true },
      { title: 'Azure ML', percentage: '0.85%', name: 'Microsoft', isUpTrend: false },
      { title: 'TensorFlow', percentage: '2.00%', name: 'Google', isUpTrend: true },
      { title: 'PyTorch', percentage: '1.75%', name: 'Facebook', isUpTrend: true },
      { title: 'IBM Watson', percentage: '0.95%', name: 'IBM', isUpTrend: false },
      { title: 'H2O.ai', percentage: '0.60%', name: 'H2O.ai', isUpTrend: false },
      { title: 'DataRobot', percentage: '1.20%', name: 'DataRobot', isUpTrend: true },
      { title: 'BigML', percentage: '0.70%', name: 'BigML', isUpTrend: false },
      { title: 'RapidMiner', percentage: '0.80%', name: 'RapidMiner', isUpTrend: false }
    ];
  }

  getArrowSymbol(isUpTrend: boolean): string {
    return isUpTrend ? '\u2191' : '\u2193';
  }

  getTrendStatus(isUpTrend: boolean): string {
    return isUpTrend ? 'uptrending' : 'downtrending';
  }
}
