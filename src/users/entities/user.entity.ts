import { Transaction } from 'src/transactions/entities/transaction.entity';
import { AssetType } from 'src/types/transactions';
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

  getAssetAmountMap(): { [key in AssetType]: { [key: string]: number } } {
    const assetMap = {
      [AssetType.CRYPTO]: {},
      [AssetType.STOCK]: {},
    };

    this.transactions.forEach((t) => {
      assetMap[t.assetType][t.assetId] =
        (assetMap[t.assetType][t.assetId] || 0) + t.amount;
    });

    return assetMap;
  }
}
