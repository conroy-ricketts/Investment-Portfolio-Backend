import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinGecko } from 'src/utils/CoinGecko';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  private coinGecko = new CoinGecko();
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
  ) {}

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ email });
    if (user.password !== password) return null;
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne(id, { relations: ['transactions'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) return null;
    Object.entries(updateUserDto).forEach(([key, val]) => {
      user[key] = val;
    });
    return this.userRepository.save(user);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async getCurrentPortfolio(id: string) {
    const user = await this.userRepository.findOne(id, {
      relations: ['transactions'],
    });
    const map = user.getAssetAmountMap();
    if (!Object.keys(map).length) {
      return { portfolio: 0 };
    }
    const data = await this.coinGecko.getMarkets(Object.keys(map));

    return {
      portfolio: Object.entries(map).reduce(
        (a, [k, v]) =>
          a + (data.find((d) => d.id === k)?.current_price || 0) * v,
        0,
      ),
    };
  }
}
