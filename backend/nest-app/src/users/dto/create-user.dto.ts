import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: '1234567890', description: 'Password' })
  @IsNotEmpty()
  password: string;
}
