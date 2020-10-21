import { User } from './user.model';

export class Event {
  eventId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  users?: Array<User>;

  constructor(dto?: IEventDTO) {
    Object.assign(this, dto);
  }
}

export interface IEventDTO {
  eventId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  users?: Array<User>;
}
