import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  normalizeTwilioSmsWebhook,
  verifyTwilioSignature,
  buildTwilioWebhookSetup
} from "./index";

describe("twilio connector", () => {
  const webhookUrl = "https://example.com/api/webhooks/twilio";
  const authToken = "twilio-auth-token";
  const payload = {
    AccountSid: "AC123",
    MessageSid: "SM123",
    From: "+15551234567",
    To: "+15557654321",
    Body: "Can I book for Friday?"
  };

  it("builds plain webhook setup guidance", () => {
    expect(buildTwilioWebhookSetup(webhookUrl)).toMatchObject({
      webhookUrl,
      method: "POST"
    });
  });

  it("accepts valid Twilio signatures", () => {
    const signature = sign(webhookUrl, payload, authToken);

    expect(verifyTwilioSignature({ url: webhookUrl, payload, authToken, signature })).toBe(true);
  });

  it("rejects invalid Twilio signatures", () => {
    expect(
      verifyTwilioSignature({
        url: webhookUrl,
        payload,
        authToken,
        signature: "bad-signature"
      })
    ).toBe(false);
  });

  it("normalizes valid SMS webhooks into inbox messages", () => {
    const message = normalizeTwilioSmsWebhook({
      id: "msg_twilio_1",
      userId: "user_1",
      connectionId: "conn_twilio",
      receivedAt: new Date("2026-06-16T17:00:00.000Z"),
      payload
    });

    expect(message).toMatchObject({
      source: "twilio",
      sender: "+15551234567",
      recipients: ["+15557654321"],
      preview: "Can I book for Friday?",
      sourceMetadata: {
        messageSid: "SM123",
        accountSid: "AC123"
      }
    });
  });
});

function sign(url: string, payload: Record<string, string>, authToken: string): string {
  const base = Object.keys(payload)
    .sort()
    .reduce((value, key) => `${value}${key}${payload[key]}`, url);

  return createHmac("sha1", authToken).update(base).digest("base64");
}
