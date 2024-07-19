import { Injectable, NgZone } from '@angular/core';
import { ApiResponse, QueuedFile } from '../types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from "../../../environment/environment";

interface Topic {
  name: string;
  code: string;
}


@Injectable({
  providedIn: 'root'
})
export class CallRecordingService {

  API_ROOT = environment.callAnalyzerAPI;

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  getServerSentEvent(): Observable<any> {
    return new Observable<any>(observer => {
      const eventSource = new EventSource(`${this.API_ROOT}/sse-pending-calls`);

      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(event.data);
        });
      };

      eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });
      };

      return () => eventSource.close();
    });
  }

  public uploadFiles(files: QueuedFile[]): Promise<ApiResponse | undefined> {
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
