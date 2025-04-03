import { PaymentMethod } from '../entities/PaymentMethod';
import { test } from '../fixtures/projectFixtures';

test.describe('Stripe Payment Scenarios', () => {
  const TEST_CUSTOMER_ID = 'cus_test123';

  test('should successfully process payment with Visa card', async ({ stripeService }) => {
    // Attach Visa card as default payment method
    await stripeService.attachCreditCardAsDefault(PaymentMethod.VISA, TEST_CUSTOMER_ID);

    // Create an invoice
    const invoiceId = await stripeService.createInvoice(TEST_CUSTOMER_ID);

    // Set metadata for the invoice
    await stripeService.setMetadataForServiceInvoice(invoiceId);

    // Pay the invoice
    await stripeService.payUnpaidInvoices(TEST_CUSTOMER_ID);

    // Verify invoice status
    await stripeService.verifyInvoiceStatus(invoiceId, 'paid');
  });
});
