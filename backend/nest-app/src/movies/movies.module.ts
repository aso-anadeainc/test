import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie } from './movies.model';
import { UsersModule } from '../users/users.module';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [
    SequelizeModule.forFeature([Movie]),
    UsersModule,
    FilesModule,
    AuthModule,
  ],
})
export class MoviesModule {}
