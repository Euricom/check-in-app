import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserDTO, User } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // TODO check if map function is needed

  getById(id): Observable<User> {
    return this.http.get<IUserDTO>(`api/user/${id}`).pipe(
      map((result) => {
        return new User(result);
      })
    );
  }

  create(user): Observable<User> {
    return this.http.post<IUserDTO>(`api/users`, user).pipe(
      map((result) => {
        return new User(result);
      })
    );
  }

  updateUser(id, item) {
    return this.http.put(`api/user/${id}`, item);
  }
}
