import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class BatchSigninDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  branchCode: string;

  @IsNumber()
  batchNumber: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
