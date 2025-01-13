import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({ example: 'Title', description: 'Title' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must not be empty' })
  title: string;

  @ApiProperty({ example: 'Description', description: 'Description' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must not be empty' })
  description: string;

  @ApiProperty({ example: 2025, description: 'Publishing year' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Must be a number' })
  @IsNotEmpty({ message: 'Must not be empty' })
  publishingYear: number;

  @ApiProperty({ type: 'string', description: 'Movie poster' })
  image: string;
}
