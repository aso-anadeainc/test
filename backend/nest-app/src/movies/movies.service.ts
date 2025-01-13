import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './movies.model';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie) private movieRepository: typeof Movie,
    private filesService: FilesService,
  ) {}
  async create(dto: CreateMovieDto, image: Express.Multer.File) {
    const fileName = await this.filesService.uploadFile(image);
    const movie = await this.movieRepository.create({
      ...dto,
      publishingYear: Number(dto.publishingYear),
      image: fileName,
    });
    return movie;
  }

  async findAll(userId: number, limit: number = 10, offset: number) {
    const { count, rows } = await this.movieRepository.findAndCountAll({
      where: { userId },
      include: { all: true },
      order: [['id', 'DESC']],
      limit,
      offset,
    });
    
    return {
      movies: rows,
      totalCount: count
    };
  }

  async findOne(id: number, userId: number) {
    const movie = await this.movieRepository.findOne({
      where: { id, userId },
    });
    return movie;
  }

  async update(id: number, dto: CreateMovieDto & { image?: string }, userId: number) {
    const movie = await this.movieRepository.findOne({ where: { id, userId } });
    if (!movie) {
      return null;
    }
    const updateData = {
      title: dto.title,
      description: dto.description,
      publishingYear: dto.publishingYear ? Number(dto.publishingYear) : movie.publishingYear,
      image: dto.image || movie.image,
      userId
    };

    await this.movieRepository.update(updateData, { where: { id, userId } });
    return this.findOne(id, userId);
  }
  
  async remove(id: number) {
    const movie = await this.movieRepository.destroy({ where: { id } });
    return movie;
  }
}
