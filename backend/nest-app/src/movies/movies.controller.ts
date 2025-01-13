import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/users.model';
import { join } from 'path';

const storage = diskStorage({
  destination: './static/uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage }))
  create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    const movieData = {
      ...createMovieDto,
      image: image?.filename,
      userId: user.id
    } as CreateMovieDto;
    return this.moviesService.create(movieData, image);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: { id: number;}, @Query('limit') limit: number = 10, @Query('offset') offset: number = 0) {
    return this.moviesService.findAll(user.id, limit, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    
    return this.moviesService.findOne(+id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage }))
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @CurrentUser() user: User,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const movieData = {
      ...updateMovieDto,
      image: image?.filename,
      userId: user.id
    }
    return this.moviesService.update(+id, movieData, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
