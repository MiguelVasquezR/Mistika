/**
 * SendGrid mail sender
 * Uses SendGrid v3 API via HTTP (not SMTP)
 */

import type {
  MailType,
  MailPayload,
  SendMailParams,
  SendMailResult,
  WelcomePayload,
  VerifyEmailPayload,
  ResetPasswordPayload,
  GenericPayload,
  OrderConfirmationPayload,
} from "./types";

import { renderTemplate } from "./templates/renderTemplate";

const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get template name from mail type
 */
function getTemplateName(type: MailType): string {
  return type;
}

/**
 * Validate required environment variables
 */
function validateEnv(): { ok: boolean; error?: string } {
  if (!process.env.SENDGRID_KEY) {
    return { ok: false, error: "SENDGRID_KEY is not set" };
  }

  if (!process.env.SENDGRID_FROM_EMAIL) {
    return { ok: false, error: "SENDGRID_FROM_EMAIL is not set" };
  }

  if (!isValidEmail(process.env.SENDGRID_FROM_EMAIL)) {
    return { ok: false, error: "SENDGRID_FROM_EMAIL is not a valid email" };
  }

  return { ok: true };
}

/**
 * Get email subject based on type and payload
 */
function getSubject(type: MailType, payload: MailPayload): string {
  switch (type) {
    case "welcome":
      return "¡Bienvenido a Mistika!";
    case "verify-email":
      return "Verifica tu correo electrónico";
    case "reset-password":
      return "Restablece tu contraseña";
    case "order-confirmation":
      return `Confirmación de pedido #${(payload as OrderConfirmationPayload).orderNumber}`;
    case "generic":
      return (payload as GenericPayload).subject;
    default:
      return "Notificación de Mistika";
  }
}

/**
 * Send email via SendGrid API
 */
export async function sendMail({
  type,
  to,
  payload,
}: SendMailParams): Promise<SendMailResult> {
  try {
    // Validate environment
    const envCheck = validateEnv();
    if (!envCheck.ok) {
      console.error("[Mail] Environment validation failed:", envCheck.error);
      return { ok: false, error: envCheck.error };
    }

    // Validate email
    if (!isValidEmail(to)) {
      console.error("[Mail] Invalid recipient email:", to);
      return { ok: false, error: "Invalid recipient email address" };
    }

    // Render templates
    const templateName = getTemplateName(type);
    const { html, txt } = await renderTemplate(templateName, payload);

    // Get subject
    const subject = getSubject(type, payload);

    // Build SendGrid request
    const fromEmail = process.env.SENDGRID_FROM_EMAIL!;
    const fromName = process.env.SENDGRID_FROM_NAME || "Mistika";

    const requestBody = {
      personalizations: [
        {
          to: [{ email: to }],
          subject,
        },
      ],
      from: {
        email: fromEmail,
        name: fromName,
      },
      content: [
        {
          type: "text/html",
          value: html,
        },
        {
          type: "text/plain",
          value: txt,
        },
      ],
    };

    // Send via SendGrid API
    const response = await fetch(SENDGRID_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Mail] SendGrid API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return {
        ok: false,
        error: `SendGrid API error: ${response.status} ${response.statusText}`,
      };
    }

    // Extract message ID from response headers if available
    const messageId = response.headers.get("x-message-id") || undefined;

    console.log("[Mail] Email sent successfully:", {
      type,
      to,
      messageId,
    });

    return {
      ok: true,
      messageId,
    };
  } catch (error) {
    console.error("[Mail] Unexpected error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
