import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;
}
