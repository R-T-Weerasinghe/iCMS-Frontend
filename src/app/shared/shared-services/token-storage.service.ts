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
  getEmailFromLocalStorage(keyName: string): string | null {
    const keys = Object.keys(localStorage);
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    // Find a key that includes the keyName and matches the email pattern
    const matchedKey = keys.find(key => key.includes(keyName) && emailPattern.test(key));

    // Extract the email from the matched key
    if (matchedKey) {
      const emailMatch = matchedKey.match(emailPattern);
      return emailMatch ? emailMatch[0] : null;
    }

    return null;
  }

}
