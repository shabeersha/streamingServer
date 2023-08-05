import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @IsNumber()
  videoKey: number;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  videoUrl: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  videoThumbnail: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
