// src\app\social-media-analytics\services\settings-api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { socialMediaBackendAPI } from '../../app-settings/config';

const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json');

@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {
  private apiUrl = `${socialMediaBackendAPI}/social-media/settings`;

  constructor(private http: HttpClient) { }

  getTopicAlerts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product_alerts`);
  }

  getCampaigns(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campaigns`);
  }

  getSentimentShift(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sentiment_shifts`);
  }

  setCampaigns(data: any): Observable<any> {
    return this.http.post<any>(`${socialMediaBackendAPI}/social-media/campaign-analysis/create-campaign`, data, { headers: headers });
  }

  setTopicAlerts(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add_product_alert`, data, { headers: headers });
  }

  setSentimentShift(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add_sentiment_shift_threshold`, data, { headers: headers });
  }

  updateTopicAlerts(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/product_alert/${id}`, data, { headers: headers });
  }

  updateSentimentShift(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sentiment_shift_threshold/${id}`, data, { headers: headers });
  }

  deleteThreshold(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sentiment_shift_threshold/${id}`);
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/campaign/${id}`);
  }

  deleteAlertItem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/product_alert/${id}`);
  }

  getNotificationSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/settings/notifications`);
  }

  updateNotificationSettings(settings: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/settings/notifications`, settings);
  }

}