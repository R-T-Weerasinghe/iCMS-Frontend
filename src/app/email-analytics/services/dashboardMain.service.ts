import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { BestPerformingEmailAccResponse, EmailAccEfficiencyResponse, GaugeChartResponse, InquiriesByEfficiencyEffectivenessResponse, IssueInquiryFreqByProdcuts, IssueInquiryFreqByTypeResponse, IssuesByEfficiencyEffectivenessResponse, OngoingAndClosedStatsResponse, OverallyEfficiencyEffectivenessPecentagesResponse, OverdueIssuesResponse, stat_card_single_response, TimeCardResponse, TimeGraph } from '../interfaces/dashboard';
import { INTERVALS, URLS } from './app.constants';
import { startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl: string = `${URLS.baseUrlv2}/dashboard`;
  private pollingInterval: number = INTERVALS.pollingInterval;

  constructor(private http: HttpClient) { }

  getDataForStatCards(intervalInDaysStart: number, intervalInDaysEnd: number): Observable<OngoingAndClosedStatsResponse> {
    const url = `${this.baseUrl}/get_data_for_ongoing_and_closed_stats?intervalInDaysStart=${intervalInDaysStart}&intervalInDaysEnd=${intervalInDaysEnd}`;

    return interval(this.pollingInterval).pipe(
      startWith(0),
      switchMap(() => this.http.get<OngoingAndClosedStatsResponse>(url))
    );
  }

  getCurrentOverallEfficiencyandEffectiveness(intervalIndays: number, intervalInDaysEnd: number): Observable<OverallyEfficiencyEffectivenessPecentagesResponse> {
    const url = `${this.baseUrl}/get_data_for_overall_efficiency_and_effectiveness_percentages?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;

    return interval(this.pollingInterval).pipe(
      startWith(0),
      switchMap(() => this.http.get<OverallyEfficiencyEffectivenessPecentagesResponse>(url))
    );
  }


  getDataForEffiandEffecIssues(intervalIndays: number, intervalInDaysEnd: number): Observable<IssuesByEfficiencyEffectivenessResponse> {
    const url = `${this.baseUrl}/get_data_for_issue_frequency_by_efficiency_and_effectiveness?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;
  
    return interval(this.pollingInterval).pipe(
      startWith(0),
      switchMap(() => this.http.get<IssuesByEfficiencyEffectivenessResponse>(url))
    );
  }

  getDataForEffiandEffecInquiries(intervalIndays: number, intervalInDaysEnd: number): Observable<InquiriesByEfficiencyEffectivenessResponse> {
    const url = `${this.baseUrl}/get_data_for_inquiry_frequency_by_efficiency_and_effectiveness?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;
  
    return interval(this.pollingInterval).pipe(
      startWith(0),
      switchMap(() => this.http.get<InquiriesByEfficiencyEffectivenessResponse>(url))
    );
  }

  getDataForIssueandInquiryTypes(intervalIndays: number, intervalInDaysEnd: number): Observable<IssueInquiryFreqByTypeResponse> {
    const url = `${this.baseUrl}/get_data_for_frequency_by_issue_type_and_inquiry_types?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;
  
    return interval(this.pollingInterval).pipe(
      startWith(0),
      switchMap(() => this.http.get<IssueInquiryFreqByTypeResponse>(url))
    );
  }

  getDataForProductsByIssueandInquiry(intervalIndays: number, intervalInDaysEnd: number): Observable<IssueInquiryFreqByProdcuts> {
    const url = `${this.baseUrl}/get_data_for_issue_and_inquiry_frequency_by_products?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;
  
    return interval(this.pollingInterval).pipe(
      startWith(0),
      switchMap(() => this.http.get<IssueInquiryFreqByProdcuts>(url))
    );
  }
  
  getDataForEfficiencyByEmailAcc(intervalIndays: number, intervalInDaysEnd: number): Observable<EmailAccEfficiencyResponse> {
    const url = `${this.baseUrl}/get_data_for_efficiency_by_email_acc?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;
  
    return interval(this.pollingInterval).pipe(
      startWith(0),
      switchMap(() => this.http.get<EmailAccEfficiencyResponse>(url))
    );
  }


getBestPerformingEmail(intervalIndays: number, intervalInDaysEnd: number): Observable<BestPerformingEmailAccResponse> {
  const url = `${this.baseUrl}/get_data_for_best_performing_email_acc?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;

  return interval(this.pollingInterval).pipe(
    startWith(0),
    switchMap(() => this.http.get<BestPerformingEmailAccResponse>(url))
  );
}

getOverdueIssuesdata(intervalIndays: number, intervalInDaysEnd: number): Observable<OverdueIssuesResponse> {
  const url = `${this.baseUrl}/get_data_for_overdue_issues?intervalInDaysStart=${intervalIndays}&intervalInDaysEnd=${intervalInDaysEnd}`;

  return interval(this.pollingInterval).pipe(
    startWith(0),
    switchMap(() => this.http.get<OverdueIssuesResponse>(url))
  );
}

getDataForEmailCards(intervalInDaysStart: number, intervalInDaysEnd: number): Observable<stat_card_single_response[]> {
  const url = `${this.baseUrl}/get_data_for_stat_cards?intervalInDaysStart=${intervalInDaysStart}&intervalInDaysEnd=${intervalInDaysEnd}`;

  return interval(this.pollingInterval).pipe(
    startWith(0),
    switchMap(() => this.http.get<stat_card_single_response[]>(url))
  );
}

getDataForGaugeChart(intervalInDaysStart: number, intervalInDaysEnd: number): Observable<GaugeChartResponse> {
  const url = `${this.baseUrl}/get_data_value_for_gauge_chart?intervalInDaysStart=${intervalInDaysStart}&intervalInDaysEnd=${intervalInDaysEnd}`;

  return interval(this.pollingInterval).pipe(
    startWith(0),
    switchMap(() => this.http.get<GaugeChartResponse>(url))
  );
}

getDataForTimeGraph(intervalInDaysStart: number, intervalInDaysEnd: number): Observable<TimeCardResponse> {
  return interval(this.pollingInterval).pipe(
    startWith(0),
    switchMap(() => this.http.get<TimeCardResponse>(`${URLS.baseUrlv2}/dashboard/time-graph?intervalInDaysStart=${intervalInDaysStart}&intervalInDaysEnd=${intervalInDaysEnd}`))
  );
}

getResolutionTime(intervalInDaysStart: number, intervalInDaysEnd: number): Observable<TimeGraph> {
  return interval(this.pollingInterval).pipe(
    startWith(0),
    switchMap(() => this.http.get<TimeGraph>(`${URLS.baseUrlv2}/dashboard/resolution-time?intervalInDaysStart=${intervalInDaysStart}&intervalInDaysEnd=${intervalInDaysEnd}`))
  );
}

getFirstResponseTime(intervalInDaysStart: number, intervalInDaysEnd: number): Observable<TimeGraph> {
  return interval(this.pollingInterval).pipe(
    startWith(0),
    switchMap(() => this.http.get<TimeGraph>(`${URLS.baseUrlv2}/dashboard/first-response-time?intervalInDaysStart=${intervalInDaysStart}&intervalInDaysEnd=${intervalInDaysEnd}`))
  );
}
}