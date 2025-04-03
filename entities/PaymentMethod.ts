export interface CreditCardDetails {
  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  token: string;
  zipCode: string;
}

export type CardType = 'visa' | 'masterCard' | 'insufficientFunds' | 'declineAfterAttaching';

export class PaymentMethod {
  static readonly VISA: CardType = 'visa';
  static readonly MASTERCARD: CardType = 'masterCard';
  static readonly INSUFFICIENT_FUNDS: CardType = 'insufficientFunds';
  static readonly DECLINE_AFTER_ATTACHING: CardType = 'declineAfterAttaching';

  private static readonly creditCards: Record<CardType, CreditCardDetails> = {
    [PaymentMethod.INSUFFICIENT_FUNDS]: {
      cardHolderName: 'Test Automation',
      cardNumber: '4000000000009995',
      cvv: '123',
      expirationDate: '12/28',
      token: 'tok_visa_chargeDeclinedInsufficientFunds',
      zipCode: '12345'
    },
    [PaymentMethod.DECLINE_AFTER_ATTACHING]: {
      cardHolderName: 'Test Automation',
      cardNumber: '4000000000000341',
      cvv: '123',
      expirationDate: '12/28',
      token: 'tok_chargeCustomerFail',
      zipCode: '12345'
    },
    [PaymentMethod.MASTERCARD]: {
      cardHolderName: 'Test Automation',
      cardNumber: '5555555555554444',
      cvv: '123',
      expirationDate: '06/29',
      token: 'tok_mastercard',
      zipCode: '12345'
    },
    [PaymentMethod.VISA]: {
      cardHolderName: 'Test Automation',
      cardNumber: '4242424242424242',
      cvv: '123',
      expirationDate: '12/28',
      token: 'tok_visa',
      zipCode: '12345'
    }
  };

  /**
   * Get credit card details by type
   * @param cardType Type of credit card to retrieve
   * @returns Credit card details
   */
  static getCreditCard(cardType: CardType): CreditCardDetails {
    return this.creditCards[cardType];
  }

  /**
   * Get credit card token by type
   * @param cardType Type of credit card to retrieve
   * @returns Credit card token
   */
  static getToken(cardType: CardType): string {
    return this.creditCards[cardType].token;
  }
}
