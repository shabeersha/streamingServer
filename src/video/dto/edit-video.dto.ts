import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class EditVideoDto {
  @IsNumber()
  @IsOptional()
  videoKey?: number;

  @IsString()
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  videoThumbnail?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
