import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetType } from 'src/types/transactions';
import { CoinGecko } from 'src/utils/CoinGecko';
import { Finnhub } from 'src/utils/Finnhub';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  private coinGecko = new CoinGecko();
  private finnhub: Finnhub;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.finnhub = new Finnhub(this.configService.get('FINNHUB_TOKEN'));
  }

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
    let stock = 0;
    await Promise.all(
      Object.entries(map[AssetType.STOCK]).map(async ([k, v]) => {
        stock += (await this.finnhub.getCurrentPrice(k.toUpperCase())) * v;
      }),
    );
    const crypto = Object.entries(map[AssetType.CRYPTO]).reduce(
      (a, [k, v]) => a + (data.find((d) => d.id === k)?.current_price || 0) * v,
      0,
    );
    return {
      portfolio: stock + crypto,
    };
  }
}
