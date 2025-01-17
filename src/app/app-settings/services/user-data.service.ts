import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {apiEndpoint} from "../config";

@Injectable({
  providedIn: 'root'
})
export class UserDataService{

  apiUrl = `${apiEndpoint}`;


  users: {username: string, email: string, profileImage: string}[] = [];

  constructor(private http: HttpClient) {}


  getUsers(token: string) {
    // console.log(token);
    let headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    return this.http.get<any>(this.apiUrl+'/getAllUsers', {headers});

  }

  getUsersNames(token: string) {
    // console.log(token);
    let headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    return this.http.get<any>(this.apiUrl+'/getAllUsersNames', {headers});
  }

  deleteUser(token: string, username: string) {
    let headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    return this.http.delete<any>(this.apiUrl+'/deleteUser/'+username, {headers});

  }
  getUser(token: string, username: string): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    let params : HttpParams = new HttpParams().set('username', username);
    return this.http.get<any>(this.apiUrl+'/getUserDetails', {headers, params});
  }

  disableUser(token: string, username: string) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // let body = {
    //   username
    // };
    return this.http.put<any>(this.apiUrl+'/disableUser', username, {headers});
  }

  enableUser(token: any, username: string) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // let body = {
    //   username
    // };
    return this.http.put<any>(this.apiUrl+'/enableUser', username, {headers});

  }
  getUserLogs(token: string, username: string, start_time: string, end_time: string): any {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params : HttpParams = new HttpParams().set('username', username);
    params = params.append('start_time', start_time);
    params = params.append('end_time', end_time);

    return this.http.get(`${this.apiUrl}/userLogs`, { headers, params });
  }

  getUserAuthLogs(token: string, username: string, start_time: string, end_time: string): any {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // let params : HttpParams = new HttpParams().set('username', username);
    // params = params.append('start_time', start_time);
    // params = params.append('end_time', end_time);
    return this.http.get(`${this.apiUrl}/userAuthLogs/`+username, { headers});

  }

  //   getUser(token: string, username: string): any {
  //   let headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   let params : HttpParams = new HttpParams().set('username', username);
  //   return this.http.get<any>(this.apiUrl+'/getUserDetails', {headers, params});
  // }
}
