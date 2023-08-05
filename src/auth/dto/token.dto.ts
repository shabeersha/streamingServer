import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
