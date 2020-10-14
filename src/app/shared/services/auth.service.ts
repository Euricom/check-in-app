import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLoggedIn(): boolean {
    return true;
  }

  getActiveUser(userRole?: string): Observable<User> {
    return of({
      id: 5,
      firstName: 'Adil',
      lastName: 'Khan',
      phoneNumber: '',
      email: '',
      checkedIn: [36, 5],
      role: userRole || 'Admin',
    });
  }
}
