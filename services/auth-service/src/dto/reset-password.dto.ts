import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password too weak`,
  })
  password: string;

  @IsString()
  confirm_password: string;
}
