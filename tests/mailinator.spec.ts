import {
  getInboxMessages,
  waitForMessageBySubject,
  getEmailBody, waitForOtp
} from '../utilities/mailinator';
import { test, expect } from '@playwright/test';

const inbox = 'auto1742938795902';

test.describe('Mailinator Email Tests', () => {
  test('Verify email count in user inbox', async () => {
    const messages = await getInboxMessages(inbox);
    const subjectCounts: Record<string, number> = {};

    for (const msg of messages) {
      subjectCounts[msg.subject] = (subjectCounts[msg.subject] || 0) + 1;
    }

    expect(subjectCounts).toEqual({
      'some subject': 1
    });
  });

  test('Verify email content', async () => {
    const message = await waitForMessageBySubject(inbox, 'purchase is confirmed');
    const body = await getEmailBody(inbox, message.id);
    expect(body).toContain('Thank you for your purchase');
  });

  test('Get OTP code from email', async () => {
    const otpCode = await waitForOtp(inbox, 'Verify your email');
    expect(/^\d{6}$/.test(otpCode)).toBeTruthy();
  });
});
