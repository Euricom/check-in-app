export class User {
  id: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  checkedIn: boolean;

  constructor(dto?: IUserDTO) {
    Object.assign(this, dto);
  }
}

export interface IUserDTO {
  id: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  checkedIn: boolean;
}
