import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  images: string[];

  @IsString()
  @IsNotEmpty()
  wallet_address: string;
}
