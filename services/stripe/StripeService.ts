import { PaymentMethod, type CardType } from './PaymentMethod';
import Stripe from 'stripe';
import { expect } from '@playwright/test';

export class StripeService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey);
  }

  /**
   * Retrieve all invoices for the customer and pay all unpaid invoices
   * If the invoice list does not contain any unpaid invoices, the method will fail
   * @param customerId Stripe customer ID
   */
  async payUnpaidInvoices(customerId: string): Promise<void> {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      status: 'open'
    });

    if (!invoices.data.length) {
      throw new Error('No unpaid invoices found');
    }

    for (const invoice of invoices.data) {
      if (invoice.id) {
        await this.stripe.invoices.pay(invoice.id);
      }
    }
  }

  /**
   * Set metadata for service invoice
   * @param invoiceId Stripe invoice ID
   */
  async setMetadataForServiceInvoice(invoiceId: string): Promise<void> {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }
    await this.stripe.invoices.update(invoiceId, {
      metadata: {
        serviceType: 'Premium',
        serviceDate: '2024-12-31',
        serviceCategory: 'Consulting',
        serviceDuration: '60 minutes',
        serviceLocation: 'Remote',
        serviceNotes: 'Initial consultation session'
      }
    });
  }

  /**
   * Create invoice for customer
   * @param customerId Stripe customer ID
   */
  async createInvoice(customerId: string): Promise<string> {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: 'send_invoice',
      days_until_due: 30
    });
    if (!invoice.id) {
      throw new Error('Failed to create invoice');
    }
    await this.stripe.invoiceItems.create({
      customer: customerId,
      price_data: {
        currency: 'usd',
        product: 'prod_test',
        unit_amount: 1000
      },
      quantity: 1,
      description: 'Premium service package',
      invoice: invoice.id,
      expand: ['price', 'price.product', 'tax_amounts.tax_rate', 'price.currency_options', 'tax_amounts']
    });

    return invoice.id;
  }

  /**
   * Detach payment method of the customer
   * @param customerId Stripe customer ID
   */
  async detachPaymentMethod(customerId: string): Promise<void> {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId
    });

    if (paymentMethods.data.length > 0 && paymentMethods.data[0].id) {
      await this.stripe.paymentMethods.detach(paymentMethods.data[0].id);
    }
  }

  /**
   * Attach payment method to the customer
   * @param cardType Type of credit card to attach
   * @param customerId Stripe customer ID
   */
  async attachCard(cardType: CardType, customerId: string): Promise<void> {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    const token = PaymentMethod.getCreditCard(cardType).token;
    const newPaymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: token
      }
    });

    if (!newPaymentMethod.id) {
      throw new Error('Failed to create payment method');
    }

    await this.stripe.paymentMethods.attach(newPaymentMethod.id, {
      customer: customerId
    });
  }

  /**
   * Update invoice metadata with backdated property
   * @param invoiceId Stripe invoice ID
   * @param fieldName Name of the metadata field
   * @param daysBack Number of days to backdate
   */
  async updateInvoiceMetadata(invoiceId: string, fieldName: string, daysBack: number): Promise<void> {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    await this.stripe.invoices.update(invoiceId, {
      metadata: {
        [fieldName]: formattedDate
      }
    });
  }

  /**
   * Attach payment method to the customer as default payment method
   * @param cardType Type of credit card to attach
   * @param customerId Stripe customer ID
   */
  async attachCreditCardAsDefault(cardType: CardType, customerId: string): Promise<void> {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const token = PaymentMethod.getCreditCard(cardType).token;
    const newPaymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: token
      }
    });

    if (!newPaymentMethod.id) {
      throw new Error('Failed to create payment method');
    }

    await this.stripe.paymentMethods.attach(newPaymentMethod.id, {
      customer: customerId
    });

    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: newPaymentMethod.id
      }
    });
  }

  /**
   * Verify that the invoice status is as expected
   * @param invoiceId Stripe invoice ID
   * @param expectedStatus Expected invoice status
   */
  async verifyInvoiceStatus(invoiceId: string, expectedStatus: string): Promise<void> {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    const invoice = await this.stripe.invoices.retrieve(invoiceId);
    expect(invoice.status).toBe(expectedStatus);
  }
}
