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
export class ComparisonInsightComponent implements OnChanges, OnInit {
  insights: ComparisonInsight[] = [];
  @Input() data: any[] = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.insights = this.data;
    }
  }

  ngOnInit() {
    this.insights = [
      { product: 'Gemini', percentage: '1.02%', isUpTrend: true },
      { product: 'ChatGPT', percentage: '1.50%', isUpTrend: true },
      { product: 'VertexAI', percentage: '0.85%', isUpTrend: false },
      { product: 'Sora', percentage: '2.00%', isUpTrend: true },
      { product: 'MidJourney', percentage: '1.75%', isUpTrend: false },
    ];
  }

  getArrowSymbol(isUpTrend: boolean): string {
    return isUpTrend ? '\u2191' : '\u2193';
  }

  getTrendStatus(isUpTrend: boolean): string {
    return isUpTrend ? 'UpTrending' : 'DownTrending';
  }
}
