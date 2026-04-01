type SendEmailOptions = {
  apiKey: string;
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text: string;
};

type VerificationEmailOptions = {
  appOrigin: string;
  email: string;
  verificationUrl: string;
  verificationCode: string;
  expiresInMinutes: number;
};

type OneTimeCodeEmailOptions = {
  appOrigin: string;
  email: string;
  code: string;
  expiresInMinutes: number;
  subject: string;
  eyebrow: string;
  title: string;
  intro: string;
  panelLabel: string;
  panelHelp: string;
};

type PasswordResetEmailOptions = {
  appOrigin: string;
  email: string;
  resetUrl: string;
  expiresInMinutes: number;
};

type RecoveryCodeEmailOptions = {
  appOrigin: string;
  email: string;
  recoveryCode: string;
  codeExpiresInMinutes: number;
};

export async function sendTransactionalEmail({
  apiKey,
  from,
  to,
  subject,
  html,
  text,
}: SendEmailOptions) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error (${response.status}): ${body}`);
  }
}

type AuthEmailFrameOptions = {
  appOrigin: string;
  eyebrow: string;
  title: string;
  intro: string;
  recipientLine: string;
  ctaLabel?: string;
  ctaUrl?: string;
  panelLabel?: string;
  panelValue?: string;
  panelHelp?: string;
  secondaryLine?: string;
  secondaryUrl?: string;
  footerLine: string;
};

function renderAuthEmailFrame({
  appOrigin,
  eyebrow,
  title,
  intro,
  recipientLine,
  ctaLabel,
  ctaUrl,
  panelLabel,
  panelValue,
  panelHelp,
  secondaryLine,
  secondaryUrl,
  footerLine,
}: AuthEmailFrameOptions) {
  return `
    <div style="margin:0;padding:28px 12px;background:#efe8db;font-family:Manrope,Segoe UI,Arial,sans-serif;color:#111318;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;border-collapse:collapse;background:#ffffff;border:1px solid #e7e0d6;border-radius:28px;overflow:hidden;">
              <tr>
                <td style="padding:0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:32px 32px 26px;background:linear-gradient(135deg,#eef4ff 0%,#fff6ee 55%,#edf8f0 100%);border-bottom:1px solid #ece5da;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                          <tr>
                            <td style="padding:0 0 22px;">
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#ffffff;border:1px solid #e7e0d6;border-radius:999px;">
                                <tr>
                                  <td style="padding:10px 12px 10px 10px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                                      <tr>
                                        <td align="center" valign="middle" style="width:32px;height:32px;border-radius:999px;background:#111318;color:#f1d48c;font-size:15px;font-weight:800;line-height:32px;">
                                          M
                                        </td>
                                        <td style="padding-left:10px;font-size:14px;font-weight:800;letter-spacing:0.08em;color:#111318;">
                                          MAPLE-GLOBAL
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:12px;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;color:#7c7f87;padding:0 0 12px;">
                              ${eyebrow}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:44px;line-height:1.02;font-weight:800;letter-spacing:-0.05em;color:#111318;padding:0 0 16px;">
                              ${title}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:17px;line-height:1.8;color:#4f525a;padding:0;">
                              ${intro}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:32px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                          <tr>
                            <td style="font-size:15px;line-height:1.8;color:#4f525a;padding:0 0 20px;">
                              ${recipientLine}
                            </td>
                          </tr>
                          ${
                            ctaLabel && ctaUrl
                              ? `
                          <tr>
                            <td style="padding:0 0 20px;">
                              <a href="${ctaUrl}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#111318;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;">
                                ${ctaLabel}
                              </a>
                            </td>
                          </tr>
                          `
                              : ""
                          }
                          ${
                            panelLabel && panelValue
                              ? `
                          <tr>
                            <td style="padding:0 0 20px;">
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#f8f5ef;border:1px solid #ece5da;border-radius:20px;">
                                <tr>
                                  <td style="padding:20px 22px;">
                                    <div style="font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#8a7e68;padding:0 0 10px;">
                                      ${panelLabel}
                                    </div>
                                    <div style="font-size:34px;line-height:1;font-weight:800;letter-spacing:0.28em;color:#111318;padding:0 0 12px;">
                                      ${panelValue}
                                    </div>
                                    ${
                                      panelHelp
                                        ? `<div style="font-size:14px;line-height:1.7;color:#5e615f;">${panelHelp}</div>`
                                        : ""
                                    }
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          `
                              : ""
                          }
                          ${
                            secondaryLine && secondaryUrl
                              ? `
                          <tr>
                            <td style="font-size:14px;line-height:1.8;color:#6a6d73;padding:0 0 8px;">
                              ${secondaryLine}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:14px;line-height:1.8;word-break:break-all;padding:0 0 18px;">
                              <a href="${secondaryUrl}" style="color:#111318;text-decoration:underline;">${secondaryUrl}</a>
                            </td>
                          </tr>
                          `
                              : ""
                          }
                          <tr>
                            <td style="font-size:13px;line-height:1.8;color:#8b8f97;padding-top:18px;border-top:1px solid #ece5da;">
                              Sent from <a href="${appOrigin}" style="color:#111318;text-decoration:none;font-weight:700;">MAPLE-GLOBAL</a>. ${footerLine}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim();
}

export function buildVerificationEmail({
  appOrigin,
  email,
  verificationUrl,
  verificationCode,
  expiresInMinutes,
}: VerificationEmailOptions) {
  const subject = "Verify your MAPLE-GLOBAL email address";
  const text = [
    "Verify your MAPLE-GLOBAL email address.",
    "",
    `Verification code: ${verificationCode}`,
    `This code expires in ${expiresInMinutes} minutes.`,
    "",
    `Open this link to confirm your email: ${verificationUrl}`,
    "",
    `This message was sent to ${email}.`,
  ].join("\n");

  const html = renderAuthEmailFrame({
    appOrigin,
    eyebrow: "Email verification",
    title: "Verify your email address",
    intro:
      "Confirm this address to activate your MAPLE-GLOBAL account. You can use the button below or enter the six-digit verification code on the sign-in screen.",
    recipientLine: `We received a request to verify <strong style="color:#111318;">${email}</strong>.`,
    ctaLabel: "Verify email",
    ctaUrl: verificationUrl,
    panelLabel: "Verification code",
    panelValue: verificationCode,
    panelHelp: `This code expires in ${expiresInMinutes} minutes. If you are on a device where opening the link is inconvenient, enter this code on the verification form.`,
    secondaryLine: "If the button does not work, open this secure link:",
    secondaryUrl: verificationUrl,
    footerLine: "If you did not request this email, you can safely ignore it.",
  });

  return { subject, text, html };
}

export function buildOneTimeCodeEmail({
  appOrigin,
  email,
  code,
  expiresInMinutes,
  subject,
  eyebrow,
  title,
  intro,
  panelLabel,
  panelHelp,
}: OneTimeCodeEmailOptions) {
  const text = [
    title,
    "",
    `Code: ${code}`,
    `This code expires in ${expiresInMinutes} minutes.`,
    "",
    `This message was sent to ${email}.`,
  ].join("\n");

  const html = renderAuthEmailFrame({
    appOrigin,
    eyebrow,
    title,
    intro,
    recipientLine: `We received a request for <strong style="color:#111318;">${email}</strong>.`,
    panelLabel,
    panelValue: code,
    panelHelp: `${panelHelp} This code expires in ${expiresInMinutes} minutes.`,
    footerLine: "If you did not request this email, you can safely ignore it.",
  });

  return { subject, text, html };
}

export function buildPasswordResetEmail({
  appOrigin,
  email,
  resetUrl,
  expiresInMinutes,
}: PasswordResetEmailOptions) {
  const subject = "Reset your MAPLE-GLOBAL password";
  const text = [
    "Reset your MAPLE-GLOBAL password.",
    "",
    `Open this link to choose a new password: ${resetUrl}`,
    `This link expires in ${expiresInMinutes} minutes.`,
    "",
    `This message was sent to ${email}.`,
  ].join("\n");

  const html = renderAuthEmailFrame({
    appOrigin,
    eyebrow: "Password recovery",
    title: "Reset your password",
    intro:
      "Choose a new password to regain access to your MAPLE-GLOBAL account. If opening a link is inconvenient, you can also use the six-digit recovery code flow on the login screen.",
    recipientLine: `We received a password reset request for <strong style="color:#111318;">${email}</strong>.`,
    ctaLabel: "Reset password",
    ctaUrl: resetUrl,
    secondaryLine: "If the button does not work, open this secure link:",
    secondaryUrl: resetUrl,
    footerLine: `This link expires in ${expiresInMinutes} minutes. If you did not request a password reset, you can safely ignore it.`,
  });

  return { subject, text, html };
}

export function buildRecoveryCodeEmail({
  appOrigin,
  email,
  recoveryCode,
  codeExpiresInMinutes,
}: RecoveryCodeEmailOptions) {
  const subject = "Your MAPLE-GLOBAL recovery code";
  const text = [
    "Recover your MAPLE-GLOBAL account.",
    "",
    `Recovery code: ${recoveryCode}`,
    `This recovery code expires in ${codeExpiresInMinutes} minutes.`,
    "",
    `This message was sent to ${email}.`,
  ].join("\n");

  const html = renderAuthEmailFrame({
    appOrigin,
    eyebrow: "Password recovery",
    title: "Reset your password",
    intro:
      "Use this six-digit recovery code on the MAPLE-GLOBAL recovery screen to set a new password and sign back in immediately.",
    recipientLine: `We received a password recovery request for <strong style="color:#111318;">${email}</strong>.`,
    panelLabel: "Recovery code",
    panelValue: recoveryCode,
    panelHelp: `Use this code on the MAPLE-GLOBAL recovery screen. The code expires in ${codeExpiresInMinutes} minutes.`,
    footerLine:
      "If you did not request password recovery, you can safely ignore this email.",
  });

  return { subject, text, html };
}
