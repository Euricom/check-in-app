import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getAll(): any {
    return this.http.get(`api/EventsGet`);
  }

  getById(id): any {
    return this.http.get(`api/events/${id}`);
  }

  delete(id): any {
    this.http.delete(`api/events/${id}`).subscribe();
  }

  create(event?) {
    event = {
      // id: 1,
      eventName: 'Event',
      startDate: '22/09/2020',
      endDate: '',
      users: [
        { id: 1, checkedIn: false },
        { id: 2, checkedIn: false },
        { id: 3, checkedIn: false },
      ],
    };
    this.http.post(`api/events`, event).subscribe();
  }
}
