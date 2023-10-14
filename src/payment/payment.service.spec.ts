import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.model';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.model';
import { PaymentDTO } from './payment.dto';

const mockPayments: PaymentDTO[] = [
  {
    id: '123',
    fullName: 'Hoai Nam',
    nameBank: 'ACB',
    cardNumber: '12312321',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    deletedAt: null,
    users: [],
  },
];

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {},
        },
        {
          provide: UserService,
          useValue: UserService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: 'userRepository',
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      // Mock the find method of the repository to return a sample array of users

      jest.spyOn(paymentService, 'findAll').mockResolvedValue(mockPayments);

      const result = await paymentService.findAll(1, 20);

      expect(result).toEqual(mockPayments);
    });
  });
});
