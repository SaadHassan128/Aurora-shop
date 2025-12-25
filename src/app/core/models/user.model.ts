export interface Address {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation: {
    lat: string;
    long: string;
  };
}

export interface UserName {
  firstname: string;
  lastname: string;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  name: UserName;
  address: Address;
  phone: string;
  photoUrl?: string;
  role?: UserRole;
}

export interface LoginResponse {
  token: string;
  role?: UserRole;
}
