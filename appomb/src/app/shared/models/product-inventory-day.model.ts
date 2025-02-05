import { Product } from './product.model';
import { Reseller } from './reseller.model';

export class ProductInventoryDay {
  date_disable: string;
  day: string;
  id: number;
  is_active: boolean;
  is_visible: boolean;
  next_batch: string;
  product: Product;
  store: number;
  user_creator: string;
  user_disabled: string;
  amount: number;
  amount_out: number;
  amount_in_store: number;
  reseller: Reseller;
  loading?: boolean;
  loadingNextBatch?: boolean;
}