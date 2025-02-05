const MESSAGES = [
  {
    message: 'ChargeNotCreated',
    label: 'Transação recusada'
  },
  {
    message: 'Server error:Error in issuer processing. Please try again',
    label: 'Erro ao processar a transação, por favor tente novamente.'
  },
  {
    message: 'Server error:Esta loja não possui um meio de pagamento configurado para a bandeira Amex',
    label: 'No momento não aceitamos a bandeira Amex, mas aceitamos as principais bandeiras utilizadas no Brasil, como Mastercard e Visa.'
  },
  {
    message: 'Server error:Esta loja não possui um meio de pagamento configurado para a bandeira Discover',
    label: 'No momento não aceitamos a bandeira Discover, mas aceitamos as principais bandeiras utilizadas no Brasil, como Mastercard e Visa.'
  },
  {
    message: 'Server error:Expired card.',
    label: 'Cartão expirado, por favor, exclua e cadastre o cartão com a nova data de expiração.'
  },
  {
    message: 'Server error:O campo código de segurança para a bandeira Mastercard deve conter 3 dígitos.',
    label: 'O campo código de segurança para a bandeira Mastercard deve conter 3 dígitos.'
  },
  {
    message: 'Server error:Unauthorized. Expiry date expired.',
    label: 'Cartão expirado, por favor, exclua e cadastre o cartão com a nova data de expiração.'
  },
  {
    message: 'Server error:Unauthorized. Insufficient funds.',
    label: 'Cartão sem limite suficiente.'
  },
  {
    message: 'Server error:Unauthorized. Invalid security code.',
    label: 'Código de segurança do cartão inválido, favor cadastrar novamente o cartão.'
  },
  {
    message: 'Server error:Unauthorized. Please contact the Card Issuer.',
    label: 'Compra recusada pelo emissor do cartão, favor entrar em contato com o emissor para mais informações.'
  },
  {
    message: 'Server error:Unauthorized. Restricted card.',
    label: 'Compra recusada. Cartão com restrições.'
  },
  {
    message: 'Server error:Unauthorized. Transaction type not allowed for this card.',
    label: 'Tipo de transação (crédito) não permitido para o cartão informado.'
  },
  {
    message: 'Stone|Cartão com restrição',
    label: 'Compra recusada. Cartão com restrições.'
  },
  {
    message: 'Stone|Código de segurança inválido',
    label: 'Código de segurança do cartão inválido, favor cadastrar novamente o cartão.'
  },
  {
    message: 'Stone|Cartão vencido',
    label: 'Cartão expirado, por favor, exclua e cadastre o cartão com a nova data de expiração.'
  },
  {
    message: 'Stone|Cartão inválido',
    label: 'Cartão inválido'
  },
  {
    message: 'Stone|Não aprovado',
    label: 'Compra recusada pelo emissor do cartão, favor entrar em contato com o emissor para mais informações.'
  },
  {
    message: 'Stone|Saldo insuficiente',
    label: 'Cartão sem limite suficiente.'
  }
];

export class TransactionErrorHelper {
  static byMessage(message) {
    return MESSAGES.find(i => i.message.toLowerCase() === message.toLowerCase())
  }
}
