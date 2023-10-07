import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { BillEntity } from './bill.model';
import { Repository } from 'typeorm';
import { IBaseService } from 'src/common/base.service';
import { BillCreateDTO, BillDTO } from './bill.dto';

@Injectable()
export class BillService implements IBaseService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @InjectRepository(BillEntity)
    private readonly billRepository: Repository<BillEntity>,
  ) {}
  async findAll(page = 1, show = 10): Promise<BillDTO[]> {
    return await this.billRepository.find({
      relations: ['user'],
      skip: (page - 1) * show,
      take: show,
    });
  }
  async findOne(id: string): Promise<BillDTO> {
    return await this.billRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
  async create({
    idUser,
    data,
  }: {
    idUser: string;
    data: BillCreateDTO;
  }): Promise<BillDTO> {
    const user = await this.userService.findOne(idUser);
    if (!user) throw new BadRequestException('User not found');
    const bill = new BillEntity();
    bill.typeBill = data.typeBill;
    bill.quantity = data.quantity;
    bill.status = data.status;
    bill.user = user;
    return await this.billRepository.save(bill);
  }
  async update(id: string, data: any): Promise<string> {
    const checkBill = await this.billRepository.findOne({ where: { id } });
    if (!checkBill) throw new BadRequestException('Bill not found');
    await this.billRepository.update(id, data);
    return 'Update bill successfully';
  }
  async delete(id: string): Promise<string> {
    const checkBill = this.billRepository.findOne({ where: { id } });
    if (!checkBill) throw new BadRequestException('Bill not found');
    await this.billRepository.delete(id);
    return 'Delete bill successfully';
  }
}
