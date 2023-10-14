import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  Injectable,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostCreateDTO, PostDTO } from './post.dto';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from '../utils/file';
import { ResponseInterface } from 'src/cores/response.interface';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(@Inject(PostService) private postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Get all posts' })
  @HttpCode(200)
  async findAll(): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.postService.findAll(),
    };
  }

  @Post(':idUser')
  @HttpCode(202)
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  @ApiOperation({ summary: 'Create new post' })
  @ApiConsumes('multipart/form-data') // Specify that the endpoint consumes form data
  @ApiBody({ type: PostCreateDTO })
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Param('idUser') idUser: string,
    @Body() data: PostCreateDTO,
    @UploadedFile() file: any,
  ): Promise<ResponseInterface> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `${fileName}`;
    const type = file.mimetype.split('/')[1];

    if (
      type !== 'png' &&
      type !== 'jpg' &&
      type !== 'jpeg' &&
      type !== 'avif' &&
      type !== 'webp'
    ) {
      throw new ForbiddenException('File type not supported');
    }

    saveFile(file.path, filePath);

    return {
      status: 200,
      metadata: await this.postService.create({
        idUser,
        data: {
          ...data,
          photo: filePath,
        },
      }),
    };
  }
}
