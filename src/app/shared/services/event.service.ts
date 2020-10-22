import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, IEventDTO } from './../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getAll(userId): Observable<Event[]> {
    return this.http.get<IEventDTO[]>(`api/events/${userId}`).pipe(
      map((results) => {
        return results.map((result) => {
          return new Event(result);
        });
      })
    );
  }

  getById(id): Observable<Event> {
    return this.http.get<IEventDTO>(`api/event/${id}`).pipe(
      map((result) => {
        return new Event(result);
      })
    );
  }

  delete(id): any {
    this.http.delete(`api/event/${id}`).subscribe();
  }

  create(event?) {
    return this.http.post(`api/events`, event);
  }
}
