import { Store } from './store.model';
import { User } from './user.model';
import { ProductSalesDispatchOrders } from './sales.model';
import { Address } from './address.model';

export class DispatchOrder extends Object {
  id: number;
  store: Store;
  client: User;
  amount: string;
  total: string;
  created: string;
  day_dispatch: string;
  is_admin_sale: boolean;
  is_delivery: boolean;
  address: Address;
  is_client_coming: boolean;
  can_request_help: boolean;
  delivery_receptionist: boolean;
  is_closed: boolean;
  is_reversed: boolean;
  product_sales: ProductSalesDispatchOrders[];
  closed_dt: string;
}

export class DispatchOrderRequestsProduct extends Object {
  id: number;
  name: string;
  amount: number;
}

export class DispatchOrderRequests extends Object {
  id: number;
  products: DispatchOrderRequestsProduct[];
  sale_date_text: string;
  total: number;
  store_type: number;
  is_closed: boolean;
  active_request: boolean;
  has_problem: boolean;
  can_request_help: boolean;
  problem_type_desc: boolean;
  can_rate: boolean;
  _loading_rating: boolean;
  rating: number;
  is_delivery: boolean;
  store_type_label: string;
  store_name_internal: string;
  store_name: string;
  address: string;
  pickup_rules: string;
  client_notified: boolean;
  bg_img: string;
}

export class DispatchOrderByDeliveryArea extends Object {
  id: number;
  order: number;
  label: string;
  opened: boolean;
  count: number;
  countWithDeliveryMan: number;
  items: DispatchOrderAdminList[];
}

export class DispatchOrderByHour extends Object {
  id: number;
  label: string;
  startHour: number;
  opened: boolean;
  count: number;
  countWithDeliveryMan: number;
  items: DispatchOrderAdminList[];
  itemsByDeliveryArea: DispatchOrderByDeliveryArea[];
}

export class DispatchOrderAdminList extends Object {
  id: number;
  amount: number;
  total: number;
  is_clo: boolean;
  is_cli_not: boolean;
  is_rev: boolean;
  is_del: boolean;
  is_del_rec: boolean;
  is_ads: boolean;
  is_d_free: boolean;
  is_d_free_r: string;
  d_sch_dt: string;
  d_sch_obs: string;
  is_rod: boolean;
  has_plm: boolean;
  plm_t_d: string;
  c_photo: string;
  del_addr: string;
  del_f_addr: string;
  c_name: string;
  ps: { name: string, amount: number }[];
  created: string;
  del_emp: string;
  del_emp_id: number;
  coming: boolean;
  c_r_help: boolean;
  d_hour_s: string;
  d_hour_e: string;
  d_area_id: number;
  d_area_nm: string;
  d_area_order: number;
  d_hour_id: number;
}
