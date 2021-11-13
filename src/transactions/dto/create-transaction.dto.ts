import { AssetType } from 'src/types/transactions';

export class CreateTransactionDto {
  assetId: string;
  assetType: AssetType;
  amount: number;
  assetPrice: number;
}
