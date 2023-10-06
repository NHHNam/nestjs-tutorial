import { ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseService } from 'src/common/base.service';
import { UserService } from 'src/user/user.service';
import { PaymentEntity } from './payment.model';
import { Repository } from 'typeorm';
import { PaymentCreateDTO, PaymentDTO } from './payment.dto';
import { UserEntity } from 'src/user/user.model';
import { skip } from 'node:test';
import { take } from 'lodash';

export class PaymentService implements IBaseService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(page = 1, total = 10): Promise<PaymentDTO[]> {
    const skip = page - 1;
    const take = page * total;
    console.log(skip, take);
    return await this.paymentRepository.find({
      relations: ['users'],
      skip: skip,
      take: take,
      order: { createdAt: 'DESC' },
    });
  }
  async findOne(id: any): Promise<PaymentDTO> {
    return await this.paymentRepository.findOne({
      where: { id: id },
    });
  }
  async create(data: PaymentCreateDTO): Promise<PaymentDTO> {
    const checkPaymentCardNumber = await this.paymentRepository.findOne({
      where: { cardNumber: data.cardNumber, nameBank: data.nameBank },
    });

    if (checkPaymentCardNumber)
      throw new ForbiddenException('Card number is exist');

    const payment = new PaymentEntity();
    payment.cardNumber = data.cardNumber;
    payment.fullName = data.fullName;
    payment.nameBank = data.nameBank;
    // save the payment

    return this.paymentRepository.save(payment);
  }
  async update(id: any, data: any): Promise<string> {
    const post = await this.paymentRepository.findOne({ where: { id: id } });
    if (!post) throw new ForbiddenException('Post not found');
    await this.paymentRepository.update(id, data);
    return 'Update payment successfully';
  }
  async delete(id: any): Promise<string> {
    await this.paymentRepository.delete(id); // maybe softDelete
    return 'Delete post successfully';
  }

  async createForUser(idUser: string, data: PaymentCreateDTO): Promise<any> {
    const user = await this.userService.findOne(idUser);
    if (!user) throw new ForbiddenException('User not found');

    const checkPaymentCardNumber = await this.paymentRepository.findOne({
      where: { cardNumber: data.cardNumber, nameBank: data.nameBank },
    });

    if (checkPaymentCardNumber)
      throw new ForbiddenException('Card number is exist');

    const payment: PaymentDTO = await this.create(data);

    user.payment = payment;

    await this.userRepository.save(user);

    return payment;
  }
}
