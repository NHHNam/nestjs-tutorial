import { Body, Controller, Inject, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BillService } from './bill.service';
import { ResponseInterface } from '../cores/response.interface';
import { BillCreateDTO, BillDTO } from './bill.dto';
import { getInfoDataForArray } from '../utils';

@ApiTags('bills')
@ApiBearerAuth()
@Controller('bills')
export class BillController {
  constructor(@Inject(BillService) private readonly billService: BillService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Get all bills',
  })
  @ApiOperation({ summary: 'Get all bills' })
  async findAll(): Promise<ResponseInterface> {
    const bills: BillDTO[] = await this.billService.findAll();
    return {
      status: 200,
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
        data: bills,
      }),
    };
  }

  @Post(':idUser')
  @ApiParam({
    name: 'idUser',
    description: 'Id of user',
  })
  @ApiOperation({ summary: 'Create new bill' })
  @ApiBody({ type: BillCreateDTO })
  async create(
    @Param('idUser') idUser: string,
    @Body() data: BillCreateDTO,
  ): Promise<ResponseInterface> {
    return {
      status: 201,
      metadata: await this.billService.create({ idUser, data }),
    };
  }

  @Put(':idBill')
  @ApiParam({
    name: 'idBill',
    description: 'Id of bill',
  })
  @ApiOperation({ summary: 'Handle bill' })
  async handleBill(
    @Param('idBill') idBill: string,
    @Body() data: any,
  ): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.billService.handleBill(idBill, data),
    };
  }
}
