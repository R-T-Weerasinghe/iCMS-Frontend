import { Injectable } from '@angular/core';
import { ApiResponse, CallRecording, QueuedFile } from '../types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {firstValueFrom, Observable, tap} from 'rxjs';
import { Header } from 'primeng/api';

interface Topic {
  name: string;
  code: string;
}


@Injectable({
  providedIn: 'root'
})
export class CallRecordingService {

  constructor(private http: HttpClient) {
  }

  //API_ROOT = "http://127.0.0.1:8000";
  API_ROOT = "http://ec2-52-66-17-237.ap-south-1.compute.amazonaws.com:8000";

  public uploadFiles(files: QueuedFile[]): Promise<ApiResponse|undefined> {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file.file, file.file.name);
    });
    return this.http.post<ApiResponse>(`${this.API_ROOT}/upload-calls`, formData).toPromise();
  }
  public getCallsList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_ROOT}/get-calls-list`);
  }
  public getPendingCallsList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_ROOT}/pendiing-calls-list`);
  }

  public deleteCall(call_id: string): Observable<ApiResponse> {
    const url = `${this.API_ROOT}/delete-call/${call_id}`;
    return this.http.delete<ApiResponse>(url);
  }

  public applyFeatures(duration: number, keyword: string[], sentiment_category: string[], start_date: string, end_date: string, topic: string[]): Observable<ApiResponse> {
    const url = `${this.API_ROOT}/filter-calls/`;
    // Adjust the duration value
    const adjustedDuration = duration * 60;
    const body = {
      start_date: start_date,
      end_date: end_date,
      keywords: keyword, // Use the provided keyword array
      duration: adjustedDuration, // Use the provided duration
      sentiment_category: sentiment_category,
      topics: topic // Use the provided topics array
    };

    // Define HTTP Headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Options including headers
    const options = {
      headers: headers
    };

    // Log URL and header data
    console.log("URL:", url);
    console.log("Headers:", headers);
    console.log("Body:", body);

    // Ensure to return the Observable from the HTTP POST request
    return this.http.post<ApiResponse>(url, body, options).pipe(
      tap((response: any) => {
        // Log the response
        console.log("Response:", response);
      })
    )
  }



}
