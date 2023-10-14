import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ResponseInterface } from '../cores/response.interface';
import { PaymentCreateDTO, PaymentDTO } from './payment.dto';
import { getInfoDataForArray } from '../utils';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject(PaymentService) private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'total', type: Number, required: false })
  async findAll(
    @Query('page') page: number,
    @Query('total') total: number,
  ): Promise<any> {
    const payments: PaymentDTO[] = await this.paymentService.findAll(
      page,
      total,
    );
    return {
      status: 200,
      pages: page ? page : 1,
      show: total ? total : 10,
      numData: payments.length,
      metadata: getInfoDataForArray({
        fields: ['id', 'fullName', 'cardNumber', 'nameBank', 'users'],
        data: payments,
      }),
    };
  }

  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new payment' })
  @ApiBody({ type: PaymentCreateDTO })
  async create(@Body() data: PaymentCreateDTO): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.paymentService.create(data),
    };
  }

  @Post('create/:idUser')
  @HttpCode(201)
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  @ApiOperation({ summary: 'Create new payment for user' })
  @ApiBody({ type: PaymentCreateDTO })
  async createPayment(
    @Param('idUser') idUser: string,
    @Body() data: PaymentCreateDTO,
  ): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.paymentService.createForUser(idUser, data),
    };
  }
}
