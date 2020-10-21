export class User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  subscribed: [
    {
     id: number,
     checkedIn: boolean
    }
  ];
  role: string;

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
  subscribed: Array<number>;
  role: string;
}
