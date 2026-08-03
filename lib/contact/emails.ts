function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function shell({
  title,
  preheader,
  body,
}: {
  title: string;
  preheader: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#05070a;color:#e8f5ef;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#0b1210;border:1px solid #1a3d2e;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #1a3d2e;background:linear-gradient(90deg,#07140f,#0b1210);">
              <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#00ff88;">FAIZAN SHAIKH</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#f4fff8;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #1a3d2e;background:#070c0a;">
              <p style="margin:0;font-size:12px;color:#7a9a8a;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
                faizanshaikh.dev · React Native &amp; Flutter
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function field(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:0 0 14px;">
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#00ff88;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${escapeHtml(label)}</p>
        <p style="margin:0;font-size:15px;line-height:1.5;color:#e8f5ef;white-space:pre-wrap;word-break:break-word;">${escapeHtml(value)}</p>
      </td>
    </tr>`;
}

export function buildOwnerNotificationEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const subject = `[Portfolio] ${input.subject}`;
  const html = shell({
    title: "New contact message",
    preheader: `${input.name} wrote: ${input.subject}`,
    body: `
      <p style="margin:0 0 18px;font-size:14px;color:#9bb5a8;">Someone reached out via faizanshaikh.dev.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        ${field("Name", input.name)}
        ${field("Email", input.email)}
        ${field("Subject", input.subject)}
        ${field("Message", input.message)}
      </table>
      <p style="margin:8px 0 0;font-size:12px;color:#7a9a8a;">Reply directly to this email to respond to ${escapeHtml(input.name)}.</p>
    `,
  });

  const text = [
    "New contact message from faizanshaikh.dev",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject}`,
    "",
    input.message,
  ].join("\n");

  return { subject, html, text };
}

export function buildVisitorAutoReplyEmail(input: {
  name: string;
  subject: string;
}): { subject: string; html: string; text: string } {
  const firstName = input.name.split(/\s+/)[0] || input.name;
  const subject = `Thanks for reaching out — Faizan Shaikh`;
  const html = shell({
    title: "Message received",
    preheader: `Thanks ${firstName}, I got your message and will reply soon.`,
    body: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#e8f5ef;">
        Hi ${escapeHtml(firstName)},
      </p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#cfe6da;">
        Thanks for writing. I received your message about
        <strong style="color:#00ff88;">${escapeHtml(input.subject)}</strong>
        and I&apos;ll get back to you as soon as I can.
      </p>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#cfe6da;">
        In the meantime, you can also find me on
        <a href="https://github.com/faizan2301" style="color:#00ff88;text-decoration:none;">GitHub</a>
        or
        <a href="https://linkedin.com/in/engineerfaizanshaikh" style="color:#00ff88;text-decoration:none;">LinkedIn</a>.
      </p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#e8f5ef;">
        — Faizan
      </p>
    `,
  });

  const text = [
    `Hi ${firstName},`,
    "",
    `Thanks for writing. I received your message about "${input.subject}" and I'll get back to you as soon as I can.`,
    "",
    "— Faizan",
    "https://www.faizanshaikh.dev",
  ].join("\n");

  return { subject, html, text };
}
