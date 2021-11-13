import { AssetType } from 'src/types/transactions';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  assetId: string;

  @Column({ enum: AssetType })
  assetType: AssetType;

  @Column()
  amount: number;

  @Column()
  assetPrice: number;

  @CreateDateColumn()
  date: Date;
}
