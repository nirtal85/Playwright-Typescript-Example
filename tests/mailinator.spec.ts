import { test } from '../fixtures/projectFixtures';
import { expect } from '@playwright/test';

const inbox = 'auto1742938795902';

test.describe(
  'Email integration tests',
  {
    annotation: [
      {
        type: 'skip',
        description: 'Requires mailinator client'
      }
    ]
  },
  () => {
    test('Verify email count in user inbox', async ({ mailinatorService }) => {
      const messages = await mailinatorService.getInboxMessages(inbox);
      const subjectCounts: Record<string, number> = {};
      for (const msg of messages) {
        subjectCounts[msg.subject] = (subjectCounts[msg.subject] || 0) + 1;
      }
      expect(subjectCounts).toMatchObject({
        'Verify Your email address': 1
      });
    });

    test('Verify email content', async ({ mailinatorService }) => {
      const message = await mailinatorService.waitForMessageBySubject(inbox, 'purchase is confirmed');
      const body = await mailinatorService.getEmailBody(message.id);
      expect(body).toContain('Thank you for your purchase');
    });

    test('Extract OTP code from email', async ({ mailinatorService }) => {
      const otpCode = await mailinatorService.waitForOtp(inbox, 'Verify Your email address');
      expect(/^\d{6}$/.test(otpCode)).toBeTruthy();
    });
  }
);
