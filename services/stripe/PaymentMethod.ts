export type CardType =
	| "visa"
	| "masterCard"
	| "insufficientFunds"
	| "declineAfterAttaching";

export interface CreditCardDetails {
	cardHolderName: string;
	cardNumber: string;
	cvv: string;
	expirationDate: string;
	token: string;
	zipCode: string;
}

/** Credit‑card test fixtures keyed by card type */
const CREDIT_CARDS: Record<CardType, CreditCardDetails> = {
	declineAfterAttaching: {
		cardHolderName: "Test Automation",
		cardNumber: "4000000000000341",
		cvv: "123",
		expirationDate: "12/28",
		token: "tok_chargeCustomerFail",
		zipCode: "12345",
	},
	insufficientFunds: {
		cardHolderName: "Test Automation",
		cardNumber: "4000000000009995",
		cvv: "123",
		expirationDate: "12/28",
		token: "tok_visa_chargeDeclinedInsufficientFunds",
		zipCode: "12345",
	},
	masterCard: {
		cardHolderName: "Test Automation",
		cardNumber: "5555555555554444",
		cvv: "123",
		expirationDate: "06/29",
		token: "tok_mastercard",
		zipCode: "12345",
	},
	visa: {
		cardHolderName: "Test Automation",
		cardNumber: "4242424242424242",
		cvv: "123",
		expirationDate: "12/28",
		token: "tok_visa",
		zipCode: "12345",
	},
};
export const VISA = "visa" satisfies CardType;
export const MASTERCARD = "masterCard" satisfies CardType;
export const INSUFFICIENT_FUNDS = "insufficientFunds" satisfies CardType;
export const DECLINE_AFTER_ATTACHING =
	"declineAfterAttaching" satisfies CardType;

export function getCreditCard(cardType: CardType): CreditCardDetails {
	return CREDIT_CARDS[cardType];
}
