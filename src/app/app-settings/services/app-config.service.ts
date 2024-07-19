import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {apiEndpoint} from "../config";

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  apiUrl = `${apiEndpoint}`;

  constructor(private http: HttpClient ) { }

  getSubscribedUsers(token: string): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl+'/get_subscribed_users', {headers});
  }

  setSubscribedUsers(token: string, users:{username:string, type:string} []): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(users)
    return this.http.post<any>(this.apiUrl+'/set_subscribed_users', users, {headers});
  }

  getWeights(token: string): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl+'/get_weights', {headers});
  }

  getAverageActions(token: string): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl+'/get_average_actions', {headers});
  }

  setAverageActions(token: string, actions: any): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl+'/set_average_actions', actions, {headers});
  }
  setWeights(token: string, weights: any): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl+'/set_weights', weights, {headers});
  }
  getRules(token: string): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl+'/get_rules', {headers});
  }

  setRules(token: string, rules: any): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl+'/set_rules', rules, {headers});
  }
}
