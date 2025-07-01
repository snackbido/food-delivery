import { IsString, Matches, MinLength } from 'class-validator';

export class ChangedPasswordDTO {
  @IsString()
  current_password: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password too weak`,
  })
  new_password: string;

  @IsString()
  confirm_password: string;
}
