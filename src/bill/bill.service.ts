import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { BillEntity } from './bill.model';
import { DataSource, Repository } from 'typeorm';
import { IBaseService } from '../common/base.service';
import { BillCreateDTO, BillDTO } from './bill.dto';
import { Status } from '../enums/bill.enum';

@Injectable()
export class BillService implements IBaseService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @InjectRepository(BillEntity)
    private readonly billRepository: Repository<BillEntity>,
    private dataSource: DataSource,
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

  // #region service

  async handleBill(idBill: string, status = Status.Completed): Promise<string> {
    const bill: BillDTO = await this.billRepository.findOne({
      where: { id: idBill },
    });
    if (!bill) throw new BadRequestException('Bill not found');

    if (bill.typeBill === 'topup')
      return await this.handleBillTopUp(idBill, status);
  }

  async handleBillTopUp(
    idBill: string,
    status = Status.Completed,
  ): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bill: BillDTO = await this.billRepository.findOne({
        where: { id: idBill },
      });
      if (!bill) throw new BadRequestException('Bill not found');

      if (bill.typeBill !== 'topup')
        throw new BadRequestException('Bill is not top up');

      const user = await this.userService.findOne(bill.user.id);
      if (!user) throw new BadRequestException('User not found');

      if (status === Status.Completed) {
        if (bill.status !== Status.Pending) {
          throw new BadRequestException('Bill is not pending');
        }
        user.point += bill.quantity;

        await this.userService.update(user.id, user);

        bill.status = Status.Completed;

        await this.billRepository.update(bill.id, bill);

        await queryRunner.commitTransaction();
        return 'Top up successfully';
      } else if (status === Status.Cancelled) {
        if (bill.status === Status.Completed) {
          const calculatePoint = user.point - bill.quantity;
          if (calculatePoint < 0)
            throw new BadRequestException('Not enough point');

          user.point = calculatePoint;

          await this.userService.update(user.id, user);

          bill.status = Status.Cancelled;

          await this.billRepository.update(bill.id, bill);
          return 'Reject successfully';
        } else if (bill.status === Status.Pending) {
          bill.status = Status.Cancelled;

          await this.billRepository.update(bill.id, bill);
          return 'Reject successfully';
        }
      } else {
        if (bill.status === Status.Cancelled) {
          bill.status = Status.Pending;

          await this.billRepository.update(bill.id, bill);
          return 'Revert successfully';
        } else {
          throw new BadRequestException(`${status} is not valid`);
        }
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  // #endregion
}
