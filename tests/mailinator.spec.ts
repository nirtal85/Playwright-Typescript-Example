import {
  getInboxMessages,
  waitForMessageBySubject,
  getEmailBody, waitForOtp
} from '../utilities/mailinator';
import { test, expect } from '@playwright/test';

const inbox = 'auto1742938795902';

test.describe.skip(
  'Email integration tests',
  { annotation: [
    {
      type: 'skip',
      description: 'Requires mailinator client'
    }
  ]
  },
  () => {
    test('Verify email count in user inbox', async () => {
      const messages = await getInboxMessages(inbox);
      const subjectCounts: Record<string, number> = {};
      for (const msg of messages) {
        subjectCounts[msg.subject] = (subjectCounts[msg.subject] || 0) + 1;
      }
      expect(subjectCounts).toMatchObject({
        'Verify Your email address': 1
      });
    });

    test('Verify email content', async () => {
      const message = await waitForMessageBySubject(inbox, 'purchase is confirmed');
      const body = await getEmailBody(message.id);
      expect(body).toContain('Thank you for your purchase');
    });

    test('Extract OTP code from email', async () => {
      const otpCode = await waitForOtp(inbox, 'Verify Your email address');
      expect(/^\d{6}$/.test(otpCode)).toBeTruthy();
    });
  }
);
