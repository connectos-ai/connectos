import { createHmac, timingSafeEqual } from "node:crypto";
import { createTwilioInboxMessage, type InboxMessage } from "@connect-any-inbox/inbox-core";

export interface TwilioWebhookSetup {
  webhookUrl: string;
  method: "POST";
  guidance: string;
}

export interface VerifyTwilioSignatureInput {
  url: string;
  payload: Record<string, string>;
  authToken: string;
  signature: string;
}

export interface NormalizeTwilioSmsWebhookInput {
  id: string;
  userId: string;
  connectionId: string;
  receivedAt: Date;
  payload: {
    AccountSid: string;
    MessageSid: string;
    From: string;
    To: string;
    Body: string;
  };
}

export function buildTwilioWebhookSetup(webhookUrl: string): TwilioWebhookSetup {
  return {
    webhookUrl,
    method: "POST",
    guidance: "Add this URL to the Twilio phone number's incoming message webhook."
  };
}

export function verifyTwilioSignature(input: VerifyTwilioSignatureInput): boolean {
  const expected = signTwilioPayload(input.url, input.payload, input.authToken);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(input.signature);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

export function normalizeTwilioSmsWebhook(
  input: NormalizeTwilioSmsWebhookInput
): InboxMessage {
  return createTwilioInboxMessage({
    id: input.id,
    userId: input.userId,
    connectionId: input.connectionId,
    messageSid: input.payload.MessageSid,
    accountSid: input.payload.AccountSid,
    from: input.payload.From,
    to: input.payload.To,
    body: input.payload.Body,
    receivedAt: input.receivedAt
  });
}

function signTwilioPayload(
  url: string,
  payload: Record<string, string>,
  authToken: string
): string {
  const base = Object.keys(payload)
    .sort()
    .reduce((value, key) => `${value}${key}${payload[key]}`, url);

  return createHmac("sha1", authToken).update(base).digest("base64");
}
