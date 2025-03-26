import { GetInboxRequest, GetMessageLinksRequest, GetMessageRequest, MailinatorClient } from 'mailinator-client';

const client = new MailinatorClient(process.env.MAILINATOR_API_TOKEN);
const domain = process.env.MAILINATOR_DOMAIN || 'public';

/**
 * Fetch all messages in an inbox.
 * @param inbox The Mailinator inbox (without @mailinator.com).
 */
export async function getInboxMessages(inbox: string) {
  const inboxRequest = new GetInboxRequest(domain, inbox);
  const response = await client.request(inboxRequest);
  return response.result?.msgs ?? [];
}

/**
 * Wait for a message with a specific subject to appear in the inbox.
 * @param inbox Inbox name (alias).
 * @param subject Exact subject to match.
 * @param index Optional: index if multiple emails with the same subject.
 * @param timeoutMs Max wait time in milliseconds.
 * @param pollInterval Polling interval in milliseconds.
 */
export async function waitForMessageBySubject(
  inbox: string,
  subject: string,
  index = 0,
  timeoutMs = 180000,
  pollInterval = 10000
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const messages = await getInboxMessages(inbox);
    const matching = messages
      .filter(msg => msg.subject === subject)
      .sort((a, b) => b.secondsAgo - a.secondsAgo);
    if (matching.length > index) {
      return matching[index];
    }
    await new Promise(res => setTimeout(res, pollInterval));
  }
  throw new Error(`Email with subject "${subject}" not found in inbox "${inbox}"`);
}

/**
 * Fetch the raw HTML/text body of a specific message.
 * @param messageId The message ID.
 */
export async function getEmailBody(messageId: string): Promise<string> {
  const message = await client.request(new GetMessageRequest(domain, messageId));
  return message.result?.parts?.[0]?.body || '';
}

/**
 * Fetch all links extracted from a message.
 * @param messageId The message ID.
 */
export async function getLinksFromEmail(
  messageId: string
): Promise<string[]> {
  const linksRequest = new GetMessageLinksRequest(domain, messageId);
  const linksResponse = await client.request(linksRequest);
  return linksResponse.result?.links ?? [];
}

/**
 * Extract the first 6-digit OTP from a string.
 * @param body Email body content.
 */
export function extractOtp(body: string): string {
  const match = body.match(/\b\d{6}\b/);
  if (!match) throw new Error('No OTP found in email body');
  return match[0];
}

/**
 * Extract a URL that contains the given partial text.
 * @param body Email body content.
 * @param partial Partial string within the target URL.
 */
export function extractLinkByText(body: string, partial: string): string {
  const regex = new RegExp(`https?://[^\\s"]*${partial}[^\\s")]*`, 'i');
  const match = body.match(regex);
  if (!match) throw new Error(`Link containing "${partial}" not found`);
  return match[0].replace(/&amp;/g, '&');
}

/**
 * Extract a link surrounded by specific CTA text, like "Click here (https://...)"
 * @param body Email body content.
 * @param surroundingText The CTA text before the link (e.g. "Click here").
 */
export function extractLinkBySurroundingText(body: string, surroundingText: string): string {
  const start = body.indexOf(surroundingText);
  if (start === -1) throw new Error('Surrounding text not found');
  const substring = body.substring(start);
  const match = substring.match(/\((https?:\/\/[^\s)]+)\)/);
  if (!match) throw new Error('No link found near surrounding text');
  return match[1].replace(/&amp;/g, '&');
}

/**
 * Wait for a message and extract the OTP from its body.
 * @param inbox Inbox name.
 * @param subject Subject to match.
 */
export async function waitForOtp(inbox: string, subject: string): Promise<string> {
  const message = await waitForMessageBySubject(inbox, subject);
  const body = await getEmailBody(message.id);
  return extractOtp(body);
}
