export class Event {
  eventId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  checkedIn?: boolean;

  constructor(dto?: IEventDTO) {
    Object.assign(this, dto);
  }
}

export interface IEventDTO {
  eventId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  checkedIn?: boolean;
}
