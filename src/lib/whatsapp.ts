interface WhatsAppMessage {
  to: string;
  body: string;
  phoneNumberId: string;
  token: string;
}

export async function sendWhatsAppMessage({
  to,
  body,
  phoneNumberId,
  token,
}: WhatsAppMessage) {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API error: ${error}`);
  }

  return response.json();
}

export function parseWhatsAppWebhook(body: Record<string, unknown>): {
  from: string;
  message: string;
  messageId: string;
  phoneNumberId: string;
} | null {
  try {
    const entry = body.entry as Array<{
      changes: Array<{
        value: {
          metadata: { phone_number_id: string };
          messages?: Array<{
            from: string;
            id: string;
            text?: { body: string };
          }>;
        };
      }>;
    }>;

    const change = entry?.[0]?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message?.text?.body) return null;

    return {
      from: message.from,
      message: message.text.body,
      messageId: message.id,
      phoneNumberId: value.metadata.phone_number_id,
    };
  } catch {
    return null;
  }
}
