import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  branchCode: string;

  @IsNumber()
  batchNumber: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
