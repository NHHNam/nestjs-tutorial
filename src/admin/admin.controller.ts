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
import { PostCreateDTO } from 'src/post/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from 'src/utils/file';
import { ResponseInterface } from 'src/cores/response.interface';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(@Inject(AdminService) private adminService: AdminService) {}

  // #region Post

  @Get('posts/:idPost')
  @ApiParam({
    name: 'idPost',
    description: 'Id of post',
  })
  async getPost(@Param('idPost') idPost: string): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.getPostById(idPost),
    };
  }

  @Get('posts')
  async getAllPosts(): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.getAllPosts(),
    };
  }

  @Post('posts/create/:idUser')
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
      metadata: await this.adminService.createPost({
        idUser,
        data: {
          ...data,
          photo: filePath,
        },
      }),
    };
  }

  @Put('posts/update/:idPost')
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
  ): Promise<ResponseInterface> {
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
  @Delete('posts/delete/:idPost')
  async deletePost(
    @Param('idPost') idPost: string,
  ): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.deletePost(idPost),
    };
  }

  // #endregion

  // #region User

  @Get('users/:idUser')
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  async getUser(@Param('idUser') idUser: string): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.getUserById(idUser),
    };
  }

  @Get('users')
  async getAllUsers(): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.getAllUsers(),
    };
  }

  @Post('users/create')
  @ApiBody({ type: PostCreateDTO })
  async createUser(@Body() data: PostCreateDTO): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.createUser(data),
    };
  }

  @Put('users/update/:idUser')
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  @ApiBody({ type: PostCreateDTO })
  async updateUser(
    @Param('idUser') idUser: string,
    @Body() data: PostCreateDTO,
  ): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.updateUser(idUser, data),
    };
  }

  @Delete('users/delete/:idUser')
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  async deleteUser(
    @Param('idUser') idUser: string,
  ): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.adminService.deleteUser(idUser),
    };
  }

  // #endregion
}
