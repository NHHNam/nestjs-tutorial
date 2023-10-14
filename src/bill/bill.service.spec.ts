import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { BillDTO } from './bill.dto';
import { BillService } from './bill.service';
import { BillEntity } from './bill.model';
import { DataSource } from 'typeorm';

const mockBills: BillDTO[] = [];

describe('BillService', () => {
  let billService: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        {
          provide: getRepositoryToken(BillEntity),
          useValue: 'userRepository',
        },
        {
          provide: UserService,
          useValue: UserService,
        },
        {
          provide: DataSource,
          useValue: 'dataSource',
        },
      ],
    }).compile();

    billService = module.get<BillService>(BillService);
  });

  it('should be defined', () => {
    expect(billService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bills', async () => {
      // Mock the find method of the repository to return a sample array of users
      jest.spyOn(billService, 'findAll').mockResolvedValue(mockBills);
      const result = await billService.findAll(1, 20);

      expect(result).toEqual(mockBills);
    });
  });
});
