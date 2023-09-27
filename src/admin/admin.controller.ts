import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { PostCreateDTO, PostDTO } from 'src/post/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from 'src/utils/file';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(@Inject(AdminService) private adminService: AdminService) {}

  // #region Post

  @Get('posts')
  async getAllPosts(): Promise<Array<PostDTO>> {
    return await this.adminService.getAllPosts();
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
    @UploadedFile() file,
  ): Promise<any> {
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
      metadata: await this.adminService.createPost({
        idUser,
        data: {
          ...data,
          photo: filePath,
        },
      }),
    };
  }

  @Put(':idPost')
  @ApiParam({
    name: 'idPost',
    description: 'Id of post',
  })
  @ApiConsumes('multipart/form-data') // Specify that the endpoint consumes form data
  @ApiBody({ type: PostCreateDTO })
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('idPost') idPost: string,
    @Body() data: PostCreateDTO,
    @UploadedFile() file,
  ): Promise<any> {
    if (file) {
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
        metadata: await this.adminService.updatePost(idPost, {
          ...data,
          photo: filePath,
        }),
      };
    } else {
      return {
        status: 200,
        metadata: await this.adminService.updatePost(idPost, data),
      };
    }
  }

  @ApiParam({
    name: 'idPost',
    description: 'Id of post',
  })
  @Delete('posts/:idPost')
  async deletePost(@Param('idPost') idPost: string): Promise<string> {
    return await this.adminService.deletePost(idPost);
  }

  // endregion
}
