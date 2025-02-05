import { Store } from './models/store.model';
import { UserAddress } from '../providers/user-address/user-address';

export interface IServerResponseError {
  status_code: number;
  error_code: string;
}

export interface IServerResponse {
  count: number;
  next: string;
  previous: string;
  results: any[];
}

export interface IUserSettings {
  store?: Store;
  document_note?: string;
  store_id?: number;
  server_date?: number;
  dispatch_today_store_ids?: number[];
  deliveryAddress?: UserAddress;
}

export interface ILastRequest {
  title?: string;
  subtitle?: string;
  userAddressId?: number;
  cityId?: number;
  storeType?: number;
  deliveryType?: number;
  storeId?: number;
}

export interface IUserProfile {
  id: number;
  user_photo: string;
  profile_photo: string;
  user_photo_social: string;
  mobile_phone: string;
  mobile_phone_area: string;
  user_has_credit_card: boolean;
  has_address_valid?: boolean;
  push_token?: boolean;
  app_version?: boolean;
  push_user_id?: boolean;
}

export interface ICreditCard {
  id: number;
  card_number: string;
  valid_date: string;
  brand: number;
  is_valid: boolean;
  need_validation: boolean;
}

export interface IFirebaseStoresDb {
  modified: string;
  storeCount: number;
  storeIds: number[];
}

export interface IFirebaseUserDataDb {
  client_credit: number;
}

export interface Page {
  title: string;
  component: any;
  icon: string;
  onlyAdmin?: boolean;
  onlyDeliveryEmployee?: boolean;
  onlyLogged?: boolean;
  hidden?: () => boolean;
  openAsRoot?: boolean;
  subTitle?: string;
  ionicColor?: string;
  ionicColorIcon?: string;
  type?: 'fa' | 'ionic';
}

export interface SecondaryMenu {
  title: string;
  icon: string;
  handler?: () => void
  hidden?: () => boolean;
  cssClass?: string;
}

export class DeliveryMethod {
  public static DELIVERY_METHOD_HOUSE = 1;
  public static DELIVERY_METHOD_STORE = 2;
}

export interface StdImage {
    thumbnail: string;
    original: string;
}
