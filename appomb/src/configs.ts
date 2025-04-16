import { Injectable } from '@angular/core';
import { ENV } from '@environment';

@Injectable()
export class AppConfig {
  DEBUG = ENV.DEBUG;
  SERVER_API = ENV.SERVER_API;
  SERVER_OAUTH2_CLIENT_ID = ENV.SERVER_OAUTH2_CLIENT_ID;
  MIXPANEL_TOKEN = ENV.MIXPANEL_TOKEN;
  GOOGLE_CLIENT_ID = ENV.GOOGLE_CLIENT_ID;
  DEBUG_EMAIL = ENV.DEBUG_EMAIL;
  DEBUG_PASSWORD = ENV.DEBUG_PASSWORD;
  CONTACT_EMAIL = ENV.CONTACT_EMAIL;
  FIREBASE_DB_INVENTORY_DAY = `${ENV.FIREBASE_PREFIX}product_store_inventory_day`;
  FIREBASE_DB_INVENTORY_DATA = `${ENV.FIREBASE_PREFIX}product_store_inventory`;
  FIREBASE_DB_OPERATING_NOTES_CHANGES = `${ENV.FIREBASE_PREFIX}operating_days_note_changed`;
  FIREBASE_DB_STORES_CHANGED = `${ENV.FIREBASE_PREFIX}stores_changed`;
  FIREBASE_DB_DELIVERY_ENDED = `${ENV.FIREBASE_PREFIX}watch_seller_delivery_ended`;
  FIREBASE_DB_DISPATCH_ORDERS = `${ENV.FIREBASE_PREFIX}dispatch_orders_v3`;
  LOGENTRIES_TOKEN = '540e9c8e-accf-43ce-8e9e-5c12c41f4ca8';
  ONESIGNAL_TOKEN = 'b6f28e50-f94c-40b8-b6a0-13164a2e69c9';
  GOOGLE_PROJECT_ID = '139965212713';
  APP_NAME = 'Oh My Bread!';

  constructor() {
  }

  // URLS
  API_CONVERT_TOKEN_PATH = '/auth/convert-token';
  API_CONVERT_GOOGLE_TOKEN = '/api/convert-token-google';
  API_REFRESH_TOKEN = '/auth/token';
  API_GET_TOKEN = '/auth/token';
  API_SIGN_UP = '/api/sign-in-new/';
  API_DELETE_ACCOUNT = '/api/delete-account/';
  API_VERIFY_EMAIL_VALIDATED = '/api/verify-email-validated/';
  API_EDIT_PASSWORD = '/api/edit-password/';
  API_SEND_RESET_PASSWORD_CODE = '/api/send-reset-password-code/';
  API_CONFIRM_RESET_PASSWORD_CODE = '/api/confirm-reset-password-code/';
  API_SET_NEW_PASSWORD_RESET = '/api/set-new-password-reset/';
  API_PRODUCT_INVENTORY = '/api/product-inventory-per-day/';
  API_ADD_PRODUCT_OUTPUT = '/api/add-output-product/';
  API_PRODUCT = '/api/product/';
  API_EDIT_PRODUCT_INVENTORY = '/api/edit-product-inventory-product/';
  API_BREADS_LIST = '/api/breads-list/';
  API_GET_APP_CONFIG = '/api/active-app-config/';
  API_CHANGE_INVENTORY_VISIBILITY = '/api/change-product-inventory-visibility/';
  API_CHANGE_INVENTORY_NEXT_BATCH = '/api/change-product-batch-hour-visibility/';
  API_EDIT_PRODUCTS_ON_DAY = '/api/edit-products-on-day/';
  API_EDIT_PRODUCTS_VISIBLE = '/api/edit-products-visible/';
  API_NOTES_DAY = '/api/operating-days-note/';
  API_CHECKOUT_LIST = '/api/v3/checkout-list/';
  API_LIST_NOTES_DAY = '/api/v2/list-operating-days-note/';
  API_STORES = '/api/store/';
  API_SET_OPERATING_NOTE_ACTIVE = '/api/set-operating-note-activate/';
  NOTIFY_USER_CHECK_VIEW = '/api/notify-user-check-card-view/';
  API_LIST_STORES_CITIES = '/api/list-stores-cities-v2/';
  API_USER_SETTINGS = '/api/user-settings/';
  API_EDIT_USER_PROFILE = '/api/edit-my-profile/';
  API_LIST_USERS_ADD_CREDIT = '/api/list-users-to-add-credit/';
  API_GET_STORES_STATE = '/api/load-store-state/';
  API_GET_STORE_NEXT_VALID_OPENED_DAYS = '/api/get-store-next-valid-opened-days/';
  API_DETAIL_USER_CREDITS = '/api/detail-user-credits/';
  API_ADD_CREDIT = '/api/add-credit/';
  API_STORE_SELLER = '/api/store-seller/';
  API_LIST_COUPON = '/api/coupon/v2/list/';
  API_DELETE_COUPON = '/api/coupon/delete/';
  API_REGISTER_COUPON = '/api/coupon/register/';
  API_BALANCE_CREDIT = '/api/balance-credit/';
  API_REMOVE_CREDIT = '/api/remove-user-credits/';
  API_CREDIT_CARD = '/api/credit-card/';
  API_PIX = '/api/pix/';
  API_VERIFYPIX = '/api/verifypix/';
  API_VALIDATE_CREDIT_CARD = '/api/validate-card/';
  API_GET_USER_DATA = '/api/me/';
  API_CREATE_PURCHASE = '/api/create-purchase/';
  API_ADMIN_CREATE_SALE = '/api/admin-create-sale/';
  API_STORE_GENERAL_BALANCE = '/api/store-general-balance/';
  API_TOGGLE_DISPATCH_CLOSED = '/api/toggle-dispatch-closed/';
  API_TOGGLE_DISPATCH_CLOSED_V2 = '/api/toggle-dispatch-closed-v2/';
  API_CHANGE_INVENTORY_ORDER = '/api/change-inventory-order/';
  API_CHANGE_PRODUCTS_ORDER = '/api/change-products-order/';
  API_CHANGE_STORES_ORDER = '/api/change-stores-order/';
  API_UPDATE_USER_NAME = '/api/update-user-name/';

  API_CHANGE_RESELLERS_ORDER = '/api/change-resellers-order/';
  API_DISPATCH_ORDERS = '/api/dispatch-orders/';
  API_USER_SALES = '/api/user-sales/';
  API_DISPATCH_ORDERS_SALES = '/api/list-dispatch-order-sales/';
  API_GET_DISPATCH_SALE = '/api/get-dispatch-sale/';
  API_USER_DISPATCH_ORDERS = 'api/user-dispatch-orders/';
  API_CANCEL_SALE = '/api/cancel-sale/';
  API_CHANGE_DEFAULT_CARD = '/api/change-default-card/';
  API_LIST_PENDING_PURCHASE = '/api/list-pending-purchase/';
  API_USER_SALE_STATE = '/api/user-sales-state/';
  API_CLIENT_IS_COMING = '/api/client-is-coming/';
  API_STORE_BALANCE_DAY = '/api/v2/store-balance-day/';
  API_USER_ADDRESS = '/api/user-address/';
  API_USER_ADDRESS_LIST = '/api/v2/user-address/';
  API_SEARCH_CEP = '/api/search-cep/';
  API_STATES = '/api/states/';
  API_CITIES = '/api/cities/';
  API_DISTRICTS = '/api/districts/';
  API_SEARCH_ADDRESS = '/api/search-address/';
  API_PLACE_INFO = '/api/place-info/';
  API_ADD_USER_ADDRESS = '/api/add-user-address/';
  API_ADD_USER_ADDRESS_SIMPLE = '/api/add-user-address-simple/';
  API_ADDRESS_DELIVERY_INFO = '/api/address-delivery-info/';

  API_LIST_DELIVERY_EMPLOYEE = '/api/list-delivery-employee/';
  API_SET_DISPATCH_DELIVERY_EMPLOYEE = '/api/set-dispatch-delivery-employee/';
  API_NOTIFY_USER_DELIVERY_INCOMING = '/api/notify-user-delivery-incoming/';
  API_REPORT_USER_DISPATCH_ORDER = '/api/report-user-dispatch-order/';
  API_SET_DISPATCH_RATING = '/api/set-dispatch-rating/';
  APP_ONE_LINK = 'http://onelink.to/ohmybread';
  API_STORE_GENERAL_BALANCE_CONTENT = '/api/store-balance/';
  API_LIST_DELIVERY_EMPLOYEES = '/api/list-delivery-employees/';

  API_BASIC_USERNAME = 'user_api@email.com';
  API_BASIC_PASSWORD = 'd8A#aCHaf#FR53eguPr4phu4peja4eK?';
  HEADER_BASIC_AUTH = `Basic ${btoa(`${this.API_BASIC_USERNAME}:${this.API_BASIC_PASSWORD}`)}`;

  MIN_LENGTH_NAME = 2;
  MAX_LENGTH_NAME = 160;
  MIN_LENGTH_PASSWORD = 4;
  MAX_LENGTH_PASSWORD = 15;


  // PER BRAND CONFIGURATION
  STATUSBAR_COLOR = '#9b8c76';
  DELIVERY_RECEPTIONIST_DEFAULT_VALUE = false;
  HEADER_UPPERCASE_DEFAULT_VALUE = true;
  DELIVERY_LABEL = `Entrega`;
  STORE_LABEL = `Loja`;
  GOOGLE_LOGIN_ENABLED = false;
  FACEBOOK_LOGIN_ENABLED = false;
  SHOW_PICKUP_RULES = true;
  SHOW_ABOUT_PAGE = false;

}
