import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() totalCalls!: number;
  @Input() avgCallTime!: number;
  @Input() totalCallDuration!: number;
  @Input() avgSentimentScore!: string;
  @Input() imgPath!: string;
  @Input() isLoading!: boolean;
}
