import { IsArray, IsString } from 'class-validator';

export class SendNewspaperDto {
  @IsArray()
  wallet_addresses: string[];

  @IsString()
  date: string;
}
