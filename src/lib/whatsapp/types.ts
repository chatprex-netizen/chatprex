/**
 * WhatsApp Meta Cloud API — Type definitions.
 *
 * Extracted and adapted from github.com/ArnasDon/wacrm
 * Cleaned of Supabase/Next.js dependencies for standalone use.
 */

// ============================================================
// Meta API version
// ============================================================

export const META_API_VERSION = 'v21.0';
export const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

// ============================================================
// Configuration
// ============================================================

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  wabaId?: string;
  verifyToken?: string;
  appSecret?: string;
  appId?: string;
  encryptionKey?: string;
}

// ============================================================
// Send results
// ============================================================

export interface MetaSendResult {
  messageId: string;
}

export interface MetaPhoneInfo {
  id: string;
  display_phone_number: string;
  verified_name?: string;
  quality_rating?: string;
}

// ============================================================
// Media
// ============================================================

export type MediaKind = 'image' | 'video' | 'document' | 'audio';

export const MEDIA_KINDS: readonly MediaKind[] = ['image', 'video', 'document', 'audio'];

export const VALID_MESSAGE_TYPES = [
  'text',
  'template',
  'interactive',
  ...MEDIA_KINDS,
] as const;

export type MessageType = (typeof VALID_MESSAGE_TYPES)[number];

// ============================================================
// Interactive messages
// ============================================================

export const INTERACTIVE_LIMITS = {
  maxButtons: 3,
  buttonTitleMaxLength: 20,
  maxListSections: 10,
  maxListRowsTotal: 10,
  listRowTitleMaxLength: 24,
  listRowDescriptionMaxLength: 72,
  bodyMaxLength: 1024,
  footerMaxLength: 60,
  headerTextMaxLength: 60,
} as const;

export interface InteractiveButton {
  /** Stable id sent back in the webhook when tapped (≤ 256 chars). */
  id: string;
  /** Visible label (≤ 20 chars per Meta). */
  title: string;
}

export interface InteractiveListRow {
  id: string;
  title: string;
  description?: string;
}

export interface InteractiveListSection {
  title?: string;
  rows: InteractiveListRow[];
}

// ============================================================
// Template types
// ============================================================

export interface MessageTemplate {
  id: string;
  name: string;
  language: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DISABLED';
  components?: TemplateComponent[];
  meta_template_id?: string;
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  buttons?: TemplateButton[];
  example?: {
    header_handle?: string[];
    header_text?: string[];
    body_text?: string[][];
  };
}

export interface TemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'COPY_CODE';
  text: string;
  url?: string;
  phone_number?: string;
  example?: string[];
}

export interface SendTimeParams {
  body?: string[];
  headerText?: string[];
  headerMediaUrl?: string;
  headerMediaId?: string;
  buttonParams?: Record<number, string>;
}

// ============================================================
// Webhook types
// ============================================================

export interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppWebhookEntry[];
}

export interface WhatsAppWebhookEntry {
  id: string;
  changes: WhatsAppWebhookChange[];
}

export interface WhatsAppWebhookChange {
  value: {
    messaging_product: string;
    metadata: {
      display_phone_number: string;
      phone_number_id: string;
    };
    contacts?: Array<{
      profile: { name: string };
      wa_id: string;
    }>;
    messages?: WhatsAppInboundMessage[];
    statuses?: WhatsAppStatusUpdate[];
  };
  field: string;
}

export interface WhatsAppInboundMessage {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string; caption?: string };
  video?: { id: string; mime_type: string; caption?: string };
  document?: {
    id: string;
    mime_type: string;
    filename?: string;
    caption?: string;
  };
  audio?: { id: string; mime_type: string };
  sticker?: { id: string; mime_type: string };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  reaction?: { message_id: string; emoji: string };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  button?: { text?: string; payload?: string };
  context?: { id: string };
}

export interface WhatsAppStatusUpdate {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
    message?: string;
  }>;
}

// ============================================================
// Registration
// ============================================================

export interface RegisterPhoneNumberResult {
  success: boolean;
  alreadyRegistered: boolean;
}

export interface SubscribedApp {
  whatsapp_business_api_data?: {
    id?: string;
    name?: string;
    link?: string;
  };
}

// ============================================================
// Template submission
// ============================================================

export interface MetaTemplateSubmitPayload {
  name: string;
  language: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  components: Array<Record<string, unknown>>;
  allow_category_change?: boolean;
}

export interface SubmitMessageTemplateResult {
  id: string;
  status: string;
  category?: string;
}

export interface EditMessageTemplateResult {
  success: boolean;
}

// ============================================================
// Error types
// ============================================================

export interface MetaErrorResponse {
  error?: { message?: string; code?: number; type?: string };
}
