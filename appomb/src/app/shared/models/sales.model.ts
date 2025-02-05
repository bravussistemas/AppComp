import { Store } from "./store.model";
import { User } from "./user.model";
import { Product } from "./product.model";
import { ICreditCard } from "../interfaces";

export class ProductSalesDispatchOrders {
  amount: number;
  id: number;
  inventory_day: number;
  price: string;
  product: Product;
  sale: number;
}

export class Sales {
  id: number;
  store: Store;
  created: string;
  price: number;
  money_change: number;
  date_sale: string;
  date_sale_display?: string;
  client: User;
  card: ICreditCard;
  is_client_coming: boolean;
  closed: boolean;
  status: number;
  status_text: string;
  delivery_address: string;
  payment_type: number;
  delivery_method: number;
  delivery_method_label: string;
  delivery_schedule_date?: string;
  delivery_schedule_observation?: string;
  payment_type_label: string;
  pickup_sale_rules?: string;
  delivery_receptionist?: string;
  is_approved: boolean;
  authorization_code: string;
  message: string;
  order: string;
  transaction_identifier: string;
  transaction_reference: string;
  product_sales: ProductSalesDispatchOrders[];
  is_reversed: boolean;
}
