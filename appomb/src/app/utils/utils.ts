import * as moment from 'moment';
import { Store } from '../shared/models/store.model';
import { OperatingDay } from '../shared/models/operating-day.model';
import { ProductInventoryDay } from '../shared/models/product-inventory-day.model';
import { Reseller } from '../shared/models/reseller.model';
import { User } from '../shared/models/user.model';
import { DeliveryMethod } from '../shared/interfaces';

export interface IStoreOperatingHour {
  openAt: string;
  closeAt: string;
}

export class Utils {
  static extractErrorResponse(response) {
  }
  
  static applyMask(value: string, mask: string): string {
    if (!value || !mask) {
      return value;
    }
  
    let formatted = '';
    let valueIndex = 0;
  
    // Itera sobre a máscara
    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      const maskChar = mask[i];
      const valueChar = value[valueIndex];
  
      // Se o caractere da máscara for um número (0), substituí-lo pelo caractere correspondente da string de entrada
      if (maskChar === '0') {
        if (/\d/.test(valueChar)) {
          formatted += valueChar;
          valueIndex++;
        }
      } else {
        // Caso contrário, é um caractere fixo da máscara (parênteses, hífen, espaço, etc.)
        formatted += maskChar;
        if (valueChar === maskChar) {
          valueIndex++;
        }
      }
    }
  
    return formatted;
  }
  

  static deliveryMethodLabel(deliveryMethod: DeliveryMethod) {
    switch (deliveryMethod) {
      case DeliveryMethod.DELIVERY_METHOD_HOUSE:
        return 'Entrega';
      case DeliveryMethod.DELIVERY_METHOD_STORE:
        return 'Loja';
      default:
        return '';
    }
  }

  static isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

  static objectSize(obj) {
    let size = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }

  static isObjectEmpty(obj: Object): boolean {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  static isNullOrUndefined(val): boolean {
    return typeof val === 'undefined' || val === null;
  }

  static isDefined(val): boolean {
    return typeof val !== 'undefined';
  }

  static toSqliteDate(date: Date | moment.Moment | string) {
    let day = moment(date).startOf('day');
    return day.format('YYYY-MM-DD');
  }

  static cleanNonDigits(val): string {
    if (!val || typeof val !== 'string') {
      return val;
    }
    return val.replace(/\D/g, '');
  }

  static validatePhoneNumber(val): boolean {
    let mobilePhone = Utils.cleanNonDigits(val);
    let rexp = new RegExp('^[1-9]{2}(?:[2-8]|9[1-9])[0-9]{3}[0-9]{4}$');
    return rexp.test(mobilePhone);
  }

  static validateDocument(val): boolean {
    val = Utils.cleanNonDigits(val);
    return Boolean(val && (Utils.validateCpf(val) || Utils.validateCnpj(val)))
  }

  static splitValue(value: string, index: number) {
    return [value.substring(0, index), value.substring(index)];
  }

  static reduceCardMask(cardNumber: string) {
    return cardNumber.replace('*******', '****');
  }

  static timeStringFormat(timeString: string, withSeconds = true) {
    if (!timeString) {
      return null;
    }
    let parts = timeString.split(':');
    if (parts.length <= 1) {
      return timeString;
    }
    if (parts.length > 2 && !withSeconds) {
      parts = [parts[0], parts[1]];
    }
    return parts.join(':');
  }

  static extractOpenAndCloseStore(store: Store): IStoreOperatingHour {
    let currentWeekDay = moment().weekday() - 1;
    let opDays = store.operating_days.filter((opDay: OperatingDay) => {
      return opDay.weekday === currentWeekDay;
    });
    if (!opDays.length) {
      return null;
    }
    let opDay = opDays[0];
    return {
      openAt: Utils.timeStringFormat(opDay.open_time, false),
      closeAt: Utils.timeStringFormat(opDay.close_time, false),
    }
  }

  static equalString(stringOne: string, stringTwo: string, sensitive = true): boolean {
    if (stringOne === null || !Utils.isDefined(stringOne)) {
      return false;
    }
    if (stringTwo === null || !Utils.isDefined(stringTwo)) {
      return false;
    }
    if (!sensitive) {
      stringOne = stringOne.toString().toLowerCase();
      stringTwo = stringTwo.toString().toLowerCase();
    }
    return stringOne.indexOf(stringTwo) > -1;
  }

  static safeAttr(obj, key) {
    return key.split('.').reduce((nestedObject, key) => {
      if (nestedObject && key in nestedObject) {
        return nestedObject[key];
      }
      return undefined;
    }, obj);
  }

  static makeResellerId(reseller: Reseller | number) {
    if (typeof reseller === 'object') {
      return `reseller_${reseller.id}`;
    }
    return `reseller_${reseller}`;
  }

  static undoResellerId(resellerId: string | number): number {
    if (typeof resellerId === 'number') {
      resellerId = resellerId.toString();
      return 0;
    }
    if (!resellerId) {
      return 0;
    }
    if (resellerId.indexOf('_') !== -1) {
      return parseInt(resellerId.split('_')[1], 10);
    }
    return 0;
  }

  static parseProductsPerReseller(items) {
    let itemsPerReseller: { [key: number]: ProductInventoryDay[] } = {};
    let sellersIds = [];
    for (let i = 0; i < items.length; i++) {
      const curItem = items[i];

      let resellerId = Utils.makeResellerId(curItem.reseller);

      if (sellersIds.indexOf(resellerId) !== -1) {
        // already in list
        itemsPerReseller[resellerId].push(curItem);
        if (itemsPerReseller[resellerId]) {
        }
      } else {
        // not in list
        sellersIds.push(resellerId);
        itemsPerReseller[resellerId] = [curItem];
      }
    }
    return {
      itemsPerReseller: itemsPerReseller,
      sellersIds: sellersIds
    }
  }

  static extractHourPartsFromJsonDate(jsonDate: string): { hour: any, minute: any } {
    if (jsonDate && jsonDate.indexOf('T') !== -1 && jsonDate.split('T').length === 2) {
      const values = jsonDate.split('T')[1].split(':');
      return {hour: values[0], minute: values[1]};
    }
    return null;
  }

  static extractHourPartsFromJsonHour(jsonHour: string): { hour: any, minute: any } {
    if (jsonHour && jsonHour.indexOf(':') !== -1 && jsonHour.split(':').length > 1) {
      const values = jsonHour.split(':');
      return {hour: values[0], minute: values[1]};
    }
    return null;
  }

  static everyMinute(func: Function): Promise<number> {
    return new Promise((resolve) => {
      const time = new Date(),
        secondsRemaining = (60 - time.getSeconds()) * 1000;
      setTimeout(() => {
        resolve(setInterval(func, 60000));
      }, secondsRemaining);
    });
  }

  static sellerStoreInOwnStore(user: User, store: Store) {
    if (!user || !store) {
      return false;
    }
    return user.is_store_seller && user.stores_seller_ids && user.stores_seller_ids.indexOf(store.id) !== -1;
  }

  static sellerStoreInOwnStoreAdmin(user: User, store: Store) {
    if (!user || !store) {
      return false;
    }
    return user.is_store_seller && user.stores_seller_ids_can_admin_app && user.stores_seller_ids_can_admin_app.indexOf(store.id) !== -1;
  }

  static copy(jsObj) {
    return JSON.parse(JSON.stringify(jsObj));
  }

  static mapToJson(resp) {
    return resp.json();
  }

  static isAdminOrStoreSeller(user: User, store: Store) {
    if (!user || !store) {
      return false;
    }
    return user.is_staff || Utils.sellerStoreInOwnStore(user, store);
  }

  static canAdminStore(user: User, store: Store) {
    if (!user || !store) {
      return false;
    }
    return user.is_staff || Utils.sellerStoreInOwnStoreAdmin(user, store);
  }
  static validateCpf(cpf) {
    if (!cpf || cpf.length != 11
      || cpf == '00000000000'
      || cpf == '11111111111'
      || cpf == '22222222222'
      || cpf == '33333333333'
      || cpf == '44444444444'
      || cpf == '55555555555'
      || cpf == '66666666666'
      || cpf == '77777777777'
      || cpf == '88888888888'
      || cpf == '99999999999')
      return false
    var soma = 0
    var resto
    for (var i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(9, 10))) return false
    soma = 0
    for (var i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(10, 11))) return false
    return true
  };

  static validateCnpj(cnpj) {
    if (!cnpj || cnpj.length != 14
      || cnpj == '00000000000000'
      || cnpj == '11111111111111'
      || cnpj == '22222222222222'
      || cnpj == '33333333333333'
      || cnpj == '44444444444444'
      || cnpj == '55555555555555'
      || cnpj == '66666666666666'
      || cnpj == '77777777777777'
      || cnpj == '88888888888888'
      || cnpj == '99999999999999')
      return false
    var tamanho = cnpj.length - 2
    var numeros = cnpj.substring(0, tamanho)
    var digitos = cnpj.substring(tamanho)
    var soma = 0
    var pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != digitos.charAt(0)) return false;
    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != digitos.charAt(1)) return false
    return true;
  };

  static maskDocument(document) {
    document = Utils.cleanNonDigits(document);
    if (document) {
      if (document.length === 11) {
        return Utils.maskCPF(document)
      }
      if (document.length === 14) {
        return Utils.maskCNPJ(document)
      }
    }
    return document
  }

  static maskCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '')
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2')
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2')
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2')
    return cnpj
  }

  static maskCPF(cpf) {
    cpf = cpf.replace(/\D/g, '')
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return cpf
  }
}
