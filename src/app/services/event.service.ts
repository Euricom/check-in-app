import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor() {}

  getAll(): Array<any> {
    return [
      {
        id: 1,
        eventName: 'DevCruise',
        startDate: 'startDate',
        endDate: 'endDate',
      },
      {
        id: 2,
        eventName: 'Boottocht',
        startDate: 'startDate',
        endDate: 'endDate',
      },
      {
        id: 3,
        eventName: 'Karting',
        startDate: 'startDate',
        endDate: 'endDate',
      },
      {
        id: 4,
        eventName: 'NG-BE',
        startDate: 'startDate',
        endDate: 'endDate',
      },
    ];
  }
}
