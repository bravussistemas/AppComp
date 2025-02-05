import * as Raven from 'raven-js';
import creditCardType from 'credit-card-type';

export class BrandUtils {
  static AMEX = 1;
  static VISA = 2;
  static MASTERCARD = 3;
  static DINERS = 4;
  static ELO = 5;
  static HIPERCARD = 29;
  static UNKNOWN = 0;

  static VISA_ICON = 'ic-visa';
  static MASTERCARD_ICON = 'ic-mastercard';
  static DINERS_ICON = 'ic-diners';
  static ELO_ICON = 'ic-elo';
  static AMEX_ICON = 'ic-amex';
  static HIPERCARD_ICON = 'ic-hipercard';
  static DEFAULT_ICON = 'ic-default';

  static toCssClass(brandId: any): string {
    try {
      brandId = parseInt(brandId, 10);
    } catch (e) {
      Raven.captureException(e);
      return BrandUtils.DEFAULT_ICON;
    }
    switch (brandId) {
      case BrandUtils.VISA:
        return BrandUtils.VISA_ICON;
      case BrandUtils.MASTERCARD:
        return BrandUtils.MASTERCARD_ICON;
      case BrandUtils.ELO:
        return BrandUtils.ELO_ICON;
      case BrandUtils.DINERS:
        return BrandUtils.DINERS_ICON;
      case BrandUtils.AMEX:
        return BrandUtils.AMEX_ICON;
      case BrandUtils.HIPERCARD:
        return BrandUtils.HIPERCARD_ICON;
      default:
        return BrandUtils.DEFAULT_ICON;
    }
  }

  static getBrandId(cardNumber) {
    const cardTypeList = creditCardType(cardNumber);
    let cardType = null;
    if (cardTypeList && cardTypeList.length === 1) {
      cardType = cardTypeList[0].type
    }
    console.log(cardType);
    switch (cardType) {
      case 'visa':
        return BrandUtils.VISA;
      case 'mastercard':
        return BrandUtils.MASTERCARD;
      case 'american-express':
        return BrandUtils.AMEX;
      case 'diners-club':
        return BrandUtils.DINERS;
      case 'discover':
      case 'elo':
        return BrandUtils.ELO;
      case 'hipercard':
        return BrandUtils.HIPERCARD;
      default:
        return BrandUtils.UNKNOWN;
    }
  }

  static getBrands() {
    return [
      {
        id: BrandUtils.VISA,
        name: 'Visa',
        icon: BrandUtils.VISA_ICON
      },
      {
        id: BrandUtils.MASTERCARD,
        name: 'Mastercard',
        icon: BrandUtils.MASTERCARD_ICON
      },
      {
        id: BrandUtils.HIPERCARD,
        name: 'Hipercard',
        icon: BrandUtils.HIPERCARD_ICON
      },
      {
        id: BrandUtils.ELO,
        name: 'Elo',
        icon: BrandUtils.ELO_ICON
      },
      {
        id: BrandUtils.DINERS,
        name: 'Diners Club',
        icon: BrandUtils.DINERS_ICON
      },
      {
        id: BrandUtils.AMEX,
        name: 'Amex',
        icon: BrandUtils.AMEX_ICON
      },
    ]
  }
}
