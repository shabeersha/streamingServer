import { IsNotEmpty, IsString } from 'class-validator';

export class ManageVideoDto {
  @IsString()
  @IsNotEmpty()
  batchId: string;

  @IsString()
  @IsNotEmpty()
  videoId: string;
}
