import { GetInboxRequest, GetMessageLinksRequest, GetMessageRequest, MailinatorClient } from 'mailinator-client';

export class MailinatorService {
  private client: MailinatorClient;
  private readonly domain: string;

  constructor(apiToken: string, domain = 'public') {
    this.client = new MailinatorClient(apiToken);
    this.domain = domain;
  }

  async getInboxMessages(inbox: string) {
    const inboxRequest = new GetInboxRequest(this.domain, inbox);
    const response = await this.client.request(inboxRequest);
    return response.result?.msgs ?? [];
  }

  async waitForMessageBySubject(
    inbox: string,
    subject: string,
    index = 0,
    timeoutMs = 180000,
    pollInterval = 10000
  ) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const messages = await this.getInboxMessages(inbox);
      const matching = messages
        .filter(message => message.subject === subject)
        .sort((a, b) => b.secondsAgo - a.secondsAgo);
      if (matching.length > index) {
        return matching[index];
      }
      await new Promise(res => setTimeout(res, pollInterval));
    }
    throw new Error(`Email with subject "${subject}" not found in inbox "${inbox}"`);
  }

  async getEmailBody(messageId: string): Promise<string> {
    const message = await this.client.request(new GetMessageRequest(this.domain, messageId));
    return message.result?.parts?.[0]?.body || '';
  }

  async getLinksFromEmail(messageId: string): Promise<string[]> {
    const linksRequest = new GetMessageLinksRequest(this.domain, messageId);
    const linksResponse = await this.client.request(linksRequest);
    return linksResponse.result?.links ?? [];
  }

  extractOtp(body: string): string {
    const match = body.match(/\b\d{6}\b/);
    if (!match) throw new Error('No OTP found in email body');
    return match[0];
  }

  extractLinkByText(body: string, partial: string): string {
    const regex = new RegExp(`https?://[^\\s"]*${partial}[^\\s")]*`, 'i');
    const match = body.match(regex);
    if (!match) throw new Error(`Link containing "${partial}" not found`);
    return match[0].replace(/&amp;/g, '&');
  }

  extractLinkBySurroundingText(body: string, surroundingText: string): string {
    const start = body.indexOf(surroundingText);
    if (start === -1) throw new Error('Surrounding text not found');
    const substring = body.substring(start);
    const match = substring.match(/\((https?:\/\/[^\s)]+)\)/);
    if (!match) throw new Error('No link found near surrounding text');
    return match[1].replace(/&amp;/g, '&');
  }

  async waitForOtp(inbox: string, subject: string): Promise<string> {
    const message = await this.waitForMessageBySubject(inbox, subject);
    const body = await this.getEmailBody(message.id);
    return this.extractOtp(body);
  }
}
