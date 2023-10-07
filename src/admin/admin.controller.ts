import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PostCreateDTO, PostDTO } from 'src/post/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from 'src/utils/file';
import { ResponseInterface } from 'src/cores/response.interface';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/enums/role.enum';
import { getInfoData, getInfoDataForArray } from 'src/utils';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@Auth(Role.Admin)
export class AdminController {
  constructor(@Inject(AdminService) private adminService: AdminService) {}

  // #region Post

  @Post('posts/:idPost')
  @ApiParam({
    name: 'idPost',
    description: 'Id of post',
  })
  @ApiOperation({
    summary: 'Get post by id',
  })
  async getPost(@Param('idPost') idPost: string): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: getInfoData({
        fields: [
          'id',
          'title',
          'description',
          'photo',
          'user.email',
          'createdAt',
          'updatedAt',
        ],
        data: await this.adminService.getPostById(idPost),
      }),
    };
  }

  @Post('posts')
  @ApiOperation({
    summary: 'Get all posts',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'total', type: Number, required: false })
  async getAllPosts(
    @Query('page') page: number,
    @Query('total') total: number,
  ): Promise<any> {
    return {
      status: 200,
      page: page ? page : 1,
      show: total ? total : 10,
      metadata: getInfoDataForArray({
        fields: [
          'id',
          'title',
          'description',
          'photo',
          'user.email',
          'createdAt',
          'updatedAt',
        ],
        data: await this.adminService.getAllPosts(page, total),
      }),
    };
  }

  @Post('posts/create/:idUser')
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  @ApiOperation({
    summary: 'Create post',
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
      throw new ForbiddenException('File type not supported');
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
  @ApiOperation({
    summary: 'Update post by id',
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
        throw new ForbiddenException('File type not supported');
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
  @ApiOperation({
    summary: 'Delete post by id',
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

  @Post('users/:idUser')
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  @ApiOperation({
    summary: 'Get user by id',
  })
  async getUser(@Param('idUser') idUser: string): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: getInfoData({
        fields: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
        data: await this.adminService.getUserById(idUser),
      }),
    };
  }

  @Post('users')
  @ApiOperation({
    summary: 'Get all users',
  })
  @HttpCode(200)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'total', type: Number, required: false })
  async getAllUsers(
    @Query('page') page: number,
    @Query('total') total: number,
  ): Promise<any> {
    return {
      status: 200,
      page: page ? page : 1,
      show: total ? total : 10,
      metadata: getInfoDataForArray({
        fields: [
          'id',
          'email',
          'role',
          'createdAt',
          'updatedAt',
          'payment',
          'bills',
          'posts',
        ],
        data: await this.adminService.getAllUsers(page, total),
      }),
    };
  }

  @Post('users/create')
  @ApiOperation({
    summary: 'Create user',
  })
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
  @ApiOperation({
    summary: 'Update user by id',
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
  @ApiOperation({
    summary: 'Delete user by id',
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

  // #region Bill

  @Post('bills')
  @ApiOperation({
    summary: 'Get all bills',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'total', type: Number, required: false })
  async getAllBills(
    @Query('page') page: number,
    @Query('total') total: number,
  ): Promise<any> {
    return {
      status: 200,
      page: page ? page : 1,
      show: total ? total : 10,
      metadata: getInfoDataForArray({
        fields: [
          'id',
          'typeBill',
          'quantity',
          'status',
          'createdAt',
          'user.id',
          'user.email',
        ],
        data: await this.adminService.getAllBills(page, total),
      }),
    };
  }

  // #endregion
}
