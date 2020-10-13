import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getById(id): any {
    return this.http.get(`api/users/${id}`);
  }

  getActiveUser(userRole: string): Observable<User> {
    return of({
      id: 5,
      firstName: 'Adil',
      lastName: 'Khan',
      phoneNumber: '',
      email: '',
      checkedIn: [36, 5],
      role: userRole,
    });
  }
}
