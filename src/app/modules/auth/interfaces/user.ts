import { HttpHeaders } from "@angular/common/http";
import { LocalDateTime } from 'aws-sdk/clients/forecastservice';

export interface User {
  email: string;
  password: string;
  token: string;
  headers: HttpHeaders;
}

export interface RegisteredUser {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Personal {
  id: number,
  email: string;
}




