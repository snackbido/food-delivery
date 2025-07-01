import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  full_name: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password too weak`,
  })
  password: string;

  @IsString()
  phone_number: string;

  @IsOptional()
  role?: string;
}
