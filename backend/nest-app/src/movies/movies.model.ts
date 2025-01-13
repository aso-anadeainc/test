import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/users.model';

interface MovieCreationAttrs {
  title: string;
  description: string;
  publishingYear: number;
  image: string;
  userId: number;
}

@Table({ tableName: 'movies' })
export class Movie extends Model<Movie, MovieCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  title: string;

  @ApiProperty({ example: 'Description', description: 'Description' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ApiProperty({ example: 2024, description: 'Release year' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  publishingYear: number;

  @ApiProperty({
    example: 'image.jpg',
    description: 'Image',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
