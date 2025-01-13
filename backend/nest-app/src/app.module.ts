import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/movies.model';
import { FilesService } from './files/files.service';
import { AuthModule } from './auth/auth.module';
@Module({
  controllers: [],
  providers: [FilesService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      models: [User, Movie],
      autoLoadModels: true,
    }),
    UsersModule,
    MoviesModule,
    AuthModule,
  ],
})
export class AppModule {}
