import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@webcol.co' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mi_password_seguro' })
  @IsString()
  @MinLength(8)
  password: string;
}
