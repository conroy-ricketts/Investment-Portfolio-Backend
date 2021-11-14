import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  getAssetAmountMap(): { [key: string]: number } {
    const assetMap = {};

    this.transactions.forEach((t) => {
      assetMap[t.assetId] = (assetMap[t.assetId] || 0) + t.amount;
    });

    return assetMap;
  }
}
