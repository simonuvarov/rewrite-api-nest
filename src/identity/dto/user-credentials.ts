import { IsEmail, Length } from 'class-validator';

export class UserCredentialsDto {
  @IsEmail()
  email: string;

  @Length(6)
  password: string;
}
