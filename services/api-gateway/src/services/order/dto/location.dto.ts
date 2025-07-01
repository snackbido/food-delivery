import { IsNumber, IsString } from 'class-validator';

export class Location {
  @IsString()
  name: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
