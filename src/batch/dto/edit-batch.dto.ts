import {
  IsOptional,
  IsNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class EditBatchDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  branchCode?: string;

  @IsNumber()
  batchNumber?: number;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @IsStrongPassword()
  password?: string;
}
