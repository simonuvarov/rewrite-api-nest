import { IsEmail, Length } from 'class-validator';

export class StudentCredentialsDto {
  @IsEmail()
  email: string;

  @Length(6)
  password: string;
}
