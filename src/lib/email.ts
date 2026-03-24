import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    _resend = new Resend(key);
  }
  return _resend;
}

export async function sendWelcomeEmail({
  email,
  name,
  businessName,
}: {
  email: string;
  name: string;
  businessName: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping welcome email");
    return;
  }

  const fromEmail =
    process.env.EMAIL_FROM || "NexoBot <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Bienvenido a NexoBot, ${name} — tu asistente AI está listo`,
      html: buildWelcomeHtml({ name, businessName, appUrl }),
    });
  } catch (error) {
    // Don't block registration if email fails
    console.error("Failed to send welcome email:", error);
  }
}

function buildWelcomeHtml({
  name,
  businessName,
  appUrl,
}: {
  name: string;
  businessName: string;
  appUrl: string;
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#030712;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:32px 40px;text-align:center;">
          <div style="display:inline-block;background-color:#4f46e5;border-radius:12px;padding:10px 12px;margin-bottom:12px;">
            <span style="color:#fff;font-size:20px;font-weight:700;">NexoBot</span>
          </div>
        </td></tr>

        <!-- Main Card -->
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.05);">
            <tr><td style="padding:48px 40px;">

              <h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-weight:700;">
                ¡Hola, ${name}! 👋
              </h1>
              <p style="margin:0 0 32px;color:#9ca3af;font-size:16px;line-height:1.6;">
                Tu cuenta para <strong style="color:#fff;">${businessName}</strong> está lista.
                Ya puedes configurar tu asistente AI y empezar a automatizar la atención al cliente.
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr><td style="padding:16px 20px;background-color:rgba(79,70,229,0.1);border-radius:12px;border:1px solid rgba(79,70,229,0.2);">
                  <p style="margin:0 0 16px;color:#a5b4fc;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                    Primeros pasos
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td style="padding:8px 0;color:#d1d5db;font-size:15px;">
                      <span style="color:#818cf8;font-weight:700;margin-right:8px;">1.</span>
                      Agrega los datos de tu negocio: servicios, horarios y precios
                    </td></tr>
                    <tr><td style="padding:8px 0;color:#d1d5db;font-size:15px;">
                      <span style="color:#818cf8;font-weight:700;margin-right:8px;">2.</span>
                      Personaliza tu bot con nombre e instrucciones
                    </td></tr>
                    <tr><td style="padding:8px 0;color:#d1d5db;font-size:15px;">
                      <span style="color:#818cf8;font-weight:700;margin-right:8px;">3.</span>
                      Instala el widget en tu web o conecta WhatsApp
                    </td></tr>
                  </table>
                </td></tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center">
                  <a href="${appUrl}/dashboard"
                     style="display:inline-block;background-color:#4f46e5;color:#fff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:12px;">
                    Ir a mi Dashboard →
                  </a>
                </td></tr>
              </table>

              <p style="margin:32px 0 0;color:#6b7280;font-size:13px;text-align:center;line-height:1.5;">
                Tu cuenta incluye 14 días gratis del plan Pro.<br/>
                Sin tarjeta de crédito requerida.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 40px;text-align:center;">
          <p style="margin:0;color:#4b5563;font-size:12px;line-height:1.5;">
            © ${new Date().getFullYear()} NexoBot. Todos los derechos reservados.<br/>
            <a href="${appUrl}" style="color:#6366f1;text-decoration:none;">nexobotai.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
