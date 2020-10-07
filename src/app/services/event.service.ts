import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getAll(): any {
    return this.http.get(`api/events`);
  }

  getById(id): any {
    return this.http.get(`api/event/${id}`);
  }

  delete(id): any {
    this.http.delete(`api/event/${id}`).subscribe();
  }

  create(event?) {
    this.http.post(`api/events`, event).subscribe();
  }
}
