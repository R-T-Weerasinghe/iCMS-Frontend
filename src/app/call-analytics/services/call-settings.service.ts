import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiResponse, CallSettingsDetails } from '../types';
import { environment } from "../../../environment/environment";

@Injectable({
  providedIn: 'root',
})
export class CallSettingsService {
  API_ROOT = environment.callAnalyzerAPI;

  constructor(private http: HttpClient) {
  }

  public getNotificationSettings(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_ROOT}/notification-settings`);
  }

  public updateNotificationSettings(settings: CallSettingsDetails): Promise<ApiResponse> {
    console.log(settings)
    return firstValueFrom(this.http.post<ApiResponse>(this.API_ROOT + '/notification-settings', settings));
  }
}
