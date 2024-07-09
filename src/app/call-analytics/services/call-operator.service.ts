import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom, Observable } from "rxjs";
import { ApiResponse, OperatorListItem } from "../types";
import { environment } from "../../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class CallOperatorService {

  constructor(private http: HttpClient) { }

  API_ROOT = environment.callAnalyzerAPI;

  public getAllOperators(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_ROOT + "/operators");
  }
  public getOperatorByEmail(operatorEmail: string): Observable<ApiResponse> {
    console.log("operatorEmail ",operatorEmail);
    const url = `${this.API_ROOT}/operators-by-email/${operatorEmail}`;
    return this.http.get<ApiResponse>(url);
  }


  public getOperatorDetails(operatorId: number): Promise<ApiResponse> {
    const url = `${this.API_ROOT}/operators/${operatorId}`;
    debugger;
    return firstValueFrom(this.http.get<ApiResponse>(url));
  }

  public addOperator(operator: OperatorListItem): Promise<ApiResponse> {
    return firstValueFrom(this.http.post<ApiResponse>(this.API_ROOT + "/operators", operator));
  }

  public deleteOperator(operatorId: string): Promise<ApiResponse> {
    return firstValueFrom(this.http.get<ApiResponse>(this.API_ROOT + "/operators/" + operatorId));
  }

  public updateOperator(operator: OperatorListItem): Promise<ApiResponse> {
    return firstValueFrom(this.http.put<ApiResponse>(this.API_ROOT + "/operators", operator));
  }

  public getNextOperatorId(): Promise<ApiResponse> {
    return firstValueFrom(this.http.get<ApiResponse>(this.API_ROOT + "/operator-id"));
  }

  public getAllCallOperatorSentiments(): Promise<ApiResponse> {
    return firstValueFrom(this.http.get<ApiResponse>(this.API_ROOT + "/average-operator-sentiment"));
  }

}
