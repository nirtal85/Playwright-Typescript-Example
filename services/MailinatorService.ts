import {
	GetInboxRequest,
	GetMessageLinksRequest,
	GetMessageRequest,
	MailinatorClient,
} from "mailinator-client";

/**
 * A service class to interact with the Mailinator API for reading emails,
 * extracting links, OTPs, and more.
 */
export class MailinatorService {
	private client: MailinatorClient;
	private readonly domain: string;

	/**
	 * Initializes the MailinatorService.
	 * @param apiToken - The Mailinator API token.
	 * @param domain - The domain to use (defaults to 'public').
	 */
	constructor(apiToken: string, domain = "public") {
		this.client = new MailinatorClient(apiToken);
		this.domain = domain;
	}

	/**
	 * Retrieves messages from a given inbox.
	 * @param inbox - The inbox name.
	 * @returns An array of messages in the inbox.
	 */
	async getInboxMessages(inbox: string) {
		const inboxRequest = new GetInboxRequest(this.domain, inbox);
		const response = await this.client.request(inboxRequest);
		return response.result?.msgs ?? [];
	}

	/**
	 * Waits for an email with a specific subject to appear in the inbox.
	 * @param inbox - The inbox name.
	 * @param subject - The subject to search for.
	 * @param index - The index of the matching email (default is 0).
	 * @param timeoutMs - How long to wait in milliseconds (default 180000).
	 * @param pollInterval - How often to poll in milliseconds (default 10000).
	 * @returns The matching message object.
	 * @throws If no matching email is found within the timeout.
	 */
	async waitForMessageBySubject(
		inbox: string,
		subject: string,
		index = 0,
		timeoutMs = 180000,
		pollInterval = 10000,
	) {
		const start = Date.now();
		while (Date.now() - start < timeoutMs) {
			const messages = await this.getInboxMessages(inbox);
			const matching = messages
				.filter((message) => message.subject === subject)
				.sort((a, b) => b.secondsAgo - a.secondsAgo);
			if (matching.length > index) {
				return matching[index];
			}
			await new Promise((res) => setTimeout(res, pollInterval));
		}
		throw new Error(
			`Email with subject "${subject}" not found in inbox "${inbox}"`,
		);
	}

	/**
	 * Fetches the plain text body of a message.
	 * @param messageId - The ID of the message.
	 * @returns The body text of the message.
	 */
	async getEmailBody(messageId: string): Promise<string> {
		const message = await this.client.request(
			new GetMessageRequest(this.domain, messageId),
		);
		return message.result?.parts?.[0]?.body || "";
	}

	/**
	 * Retrieves all hyperlinks from an email.
	 * @param messageId - The ID of the message.
	 * @returns An array of link URLs found in the message.
	 */
	async getLinksFromEmail(messageId: string): Promise<string[]> {
		const linksRequest = new GetMessageLinksRequest(this.domain, messageId);
		const linksResponse = await this.client.request(linksRequest);
		return linksResponse.result?.links ?? [];
	}

	/**
	 * Extracts a 6-digit OTP from the email body.
	 * @param body - The body of the email.
	 * @returns The extracted OTP.
	 * @throws If no OTP is found.
	 */
	extractOtp(body: string): string {
		const match = body.match(/\b\d{6}\b/);
		if (!match) throw new Error("No OTP found in email body");
		return match[0];
	}

	/**
	 * Extracts a link from the email body that contains the given partial text.
	 * @param body - The body of the email.
	 * @param partial - The partial string to match in the link.
	 * @returns The full matching link.
	 * @throws If no matching link is found.
	 */
	extractLinkByText(body: string, partial: string): string {
		const regex = new RegExp(`https?://[^\\s"]*${partial}[^\\s")]*`, "i");
		const match = body.match(regex);
		if (!match) throw new Error(`Link containing "${partial}" not found`);
		return match[0].replace(/&amp;/g, "&");
	}

	/**
	 * Extracts a link near some surrounding text in the email body.
	 * @param body - The body of the email.
	 * @param surroundingText - The text near the desired link.
	 * @returns The extracted link.
	 * @throws If no link is found near the given text.
	 */
	extractLinkBySurroundingText(body: string, surroundingText: string): string {
		const start = body.indexOf(surroundingText);
		if (start === -1) throw new Error("Surrounding text not found");
		const substring = body.substring(start);
		const match = substring.match(/\((https?:\/\/[^\s)]+)\)/);
		if (!match) throw new Error("No link found near surrounding text");
		return match[1].replace(/&amp;/g, "&");
	}

	/**
	 * Waits for an OTP email and extracts the OTP code.
	 * @param inbox - The inbox to check.
	 * @param subject - The expected email subject.
	 * @returns The extracted OTP.
	 */
	async waitForOtp(inbox: string, subject: string): Promise<string> {
		const message = await this.waitForMessageBySubject(inbox, subject);
		const body = await this.getEmailBody(message.id);
		return this.extractOtp(body);
	}
}
