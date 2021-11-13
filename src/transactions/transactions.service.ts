import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    public transactionRepository: Repository<Transaction>,
    public usersService: UsersService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) return null;
    const transaction = await this.transactionRepository.create(
      createTransactionDto,
    );
    transaction.user = user;

    return this.transactionRepository.save(transaction);
  }

  findAll() {
    return this.transactionRepository.find();
  }

  findOne(id: string) {
    return this.transactionRepository.findOne(id);
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) return null;
    Object.entries(updateTransactionDto).forEach(([key, val]) => {
      transaction[key] = val;
    });
    return this.transactionRepository.save(transaction);
  }

  remove(id: string) {
    return this.transactionRepository.delete(id);
  }
}
