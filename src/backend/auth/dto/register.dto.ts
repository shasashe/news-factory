import { IsEmail, IsString, Length } from "class-validator";

export class RegisterDto {
    email!: string;
    password!: string;
  }
  