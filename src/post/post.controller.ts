import {
  Body,
  Controller,
  Get,
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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostCreateDTO, PostDTO } from './post.dto';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from '../utils/file';
import { ResponseInterface } from 'src/cores/response.interface';

@ApiTags('posts')
// @ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(@Inject(PostService) private postService: PostService) {}

  @Get()
  async findAll(): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.postService.findAll(),
    };
  }

  @Post(':idUser')
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
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
      throw new Error('File type not supported');
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
