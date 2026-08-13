import { WhatsAppWebhookPayload, WhatsAppInboundMessage, WhatsAppStatusUpdate } from './types';

/**
 * Handle incoming Meta WhatsApp API webhook events.
 */
export function verifyWebhook(
  mode: string | null,
  verifyTokenInput: string | null,
  expectedVerifyToken: string
): boolean {
  return mode === 'subscribe' && verifyTokenInput === expectedVerifyToken;
}

export interface ParsedWebhookEvent {
  type: 'message' | 'status' | 'unknown';
  message?: WhatsAppInboundMessage;
  status?: WhatsAppStatusUpdate;
  contactName?: string;
  metadata?: {
    display_phone_number: string;
    phone_number_id: string;
  };
}

/**
 * Parse a raw Meta WhatsApp webhook payload into typed messages or status updates.
 */
export function parseInboundWebhook(payload: WhatsAppWebhookPayload): ParsedWebhookEvent[] {
  const events: ParsedWebhookEvent[] = [];

  if (payload.object !== 'whatsapp_business_account' || !payload.entry) {
    return events;
  }

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field !== 'messages' || !change.value) continue;

      const value = change.value;
      const metadata = value.metadata;

      // Status update processing
      if (value.statuses) {
        for (const status of value.statuses) {
          events.push({
            type: 'status',
            status,
            metadata
          });
        }
      }

      // Message processing
      if (value.messages) {
        for (const message of value.messages) {
          const contactName = value.contacts?.[0]?.profile?.name || `WhatsApp ${message.from}`;
          events.push({
            type: 'message',
            message,
            contactName,
            metadata
          });
        }
      }
    }
  }

  return events;
}
