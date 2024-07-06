import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  getStorageKeyValue(keyName: string): string {
    const keys = Object.keys(localStorage);
    const idTokenKey = keys.find(key => key.endsWith(keyName))!;
    return localStorage.getItem(idTokenKey)!;
  }

}
