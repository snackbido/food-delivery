import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveCartItemDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  item_id: string;
}
