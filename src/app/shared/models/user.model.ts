export class User {
  // tslint:disable-next-line:variable-name
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  subscribed?: [];
  role: string;
  checkedIn?: boolean;

  constructor(dto?: IUserDTO) {
    Object.assign(this, dto);
  }
}

export interface IUserDTO {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  subscribed?: [];
  role: string;
  checkedIn?: boolean;
}
