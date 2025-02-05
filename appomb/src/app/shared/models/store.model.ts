import { Address } from './address.model';
import { OperatingDay } from './operating-day.model';
import { OperatingDaysNote } from './operating-day-note.model';

export enum StoreTypeEnum {
  NORMAL = 0,
  POINT_OF_SALES = 1,
  DELIVERY = 2
}

export enum DeliveryTypeEnum {
  MAIN = 0,
  PIZZA = 1,
}

export class Store {
  id: number;
  limit_days_schedule_delivery: number;
  name: string;
  address: Address;
  phone: string;
  mobile: string;
  is_active: boolean;
  register_address_by_cep?: boolean;
  accept_delivery_by_district?: boolean;
  user_can_choose_delivery_hour: boolean;
  show_document_note_option: boolean;
  document_note_option_required: boolean | string;
  show_schedule_delivery_option: boolean;
  schedule_delivery_option_required: boolean;
  has_others_products: boolean;
  store_type: StoreTypeEnum;
  delivery_type: DeliveryTypeEnum;
  is_matrix: boolean;
  image: {
    thumbnail: string;
    original: string;
  };
  operating_days: OperatingDay[];
  subtitle: OperatingDaysNote;
}

export interface DeliveryEmployeeSimple {
  id: number;
  name: string;
}
