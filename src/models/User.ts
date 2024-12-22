export interface Role {
  id: number;
  name: string;
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export default interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  address?: string;
  isTwoFAEnabled: boolean;
  contact?: string;
  avatar?: string;
  status?: UserStatusEnum;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
  teamId?: number;
}
