import { expect } from "@playwright/test";
// stripe-service.ts
import Stripe from "stripe";
import { type CardType, getCreditCard } from "./PaymentMethod";

export class StripeService {
	private readonly stripe: Stripe;

	constructor(apiKey: string) {
		this.stripe = new Stripe(apiKey);
	}

	/* Retrieve all invoices for the customer and pay every unpaid invoice */
	async payUnpaidInvoices(customerId: string): Promise<void> {
		if (!customerId) throw new Error("Customer ID is required");
		const { data: invoices } = await this.stripe.invoices.list({
			customer: customerId,
			status: "open",
		});
		if (invoices.length === 0) throw new Error("No unpaid invoices found");
		await Promise.all(invoices.map((inv) => this.stripe.invoices.pay(inv.id)));
	}

	/* Stamp a service‑billing metadata block on an invoice */
	async setMetadataForServiceInvoice(invoiceId: string): Promise<void> {
		if (!invoiceId) throw new Error("Invoice ID is required");
		await this.stripe.invoices.update(invoiceId, {
			metadata: {
				serviceType: "Premium",
				serviceDate: "2024‑12‑31",
				serviceCategory: "Consulting",
				serviceDuration: "60 minutes",
				serviceLocation: "Remote",
				serviceNotes: "Initial consultation session",
			},
		});
	}

	/* Create a new invoice and seed it with one invoice‑item */
	async createInvoice(customerId: string): Promise<string> {
		if (!customerId) throw new Error("Customer ID is required");
		const invoice = await this.stripe.invoices.create({
			customer: customerId,
			auto_advance: true,
			collection_method: "send_invoice",
			days_until_due: 30,
		});
		if (!invoice.id) throw new Error("Failed to create invoice");
		await this.stripe.invoiceItems.create({
			customer: customerId,
			price_data: {
				currency: "usd",
				product: "prod_test",
				unit_amount: 1_000,
			},
			description: "Premium service package",
			invoice: invoice.id,
		});
		return invoice.id;
	}

	/* Detach the customer’s first payment‑method (if any) */
	async detachPaymentMethod(customerId: string): Promise<void> {
		if (!customerId) throw new Error("Customer ID is required");
		const { data } = await this.stripe.paymentMethods.list({
			customer: customerId,
		});
		if (data[0]?.id) await this.stripe.paymentMethods.detach(data[0].id);
	}

	/* Attach a card test‑fixture to the customer (non‑default) */
	async attachCard(cardType: CardType, customerId: string): Promise<void> {
		if (!customerId) throw new Error("Customer ID is required");
		const token = getCreditCard(cardType).token;
		const pm = await this.stripe.paymentMethods.create({
			type: "card",
			card: { token },
		});
		await this.stripe.paymentMethods.attach(pm.id, { customer: customerId });
	}

	/* Back‑date an arbitrary metadata field by N days */
	async updateInvoiceMetadata(
		invoiceId: string,
		field: string,
		daysBack: number,
	): Promise<void> {
		if (!invoiceId) throw new Error("Invoice ID is required");
		const date = new Date();
		date.setDate(date.getDate() - daysBack);
		const yyyyMmDd = date.toISOString().split("T")[0];
		await this.stripe.invoices.update(invoiceId, {
			metadata: { [field]: yyyyMmDd },
		});
	}

	/* Attach a card and set it as the customer’s default */
	async attachCreditCardAsDefault(
		cardType: CardType,
		customerId: string,
	): Promise<void> {
		if (!customerId) throw new Error("Customer ID is required");
		const token = getCreditCard(cardType).token;
		const paymentMethod = await this.stripe.paymentMethods.create({
			type: "card",
			card: { token },
		});
		await this.stripe.paymentMethods.attach(paymentMethod.id, {
			customer: customerId,
		});
		await this.stripe.customers.update(customerId, {
			invoice_settings: { default_payment_method: paymentMethod.id },
		});
	}

	/* Assert a Stripe invoice’s status */
	async verifyInvoiceStatus(
		invoiceId: string,
		expected: Stripe.Invoice.Status,
	): Promise<void> {
		if (!invoiceId) throw new Error("Invoice ID is required");
		const invoice = await this.stripe.invoices.retrieve(invoiceId);
		expect(invoice.status).toBe(expected);
	}
}
