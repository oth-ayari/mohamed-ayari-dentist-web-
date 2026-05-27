import nodemailer from 'nodemailer';
import { escapeHtml } from '@/lib/security-utils';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const CLINIC_NAME = 'Cabinet Dentaire Dr Mohamed Ben Othman Ayari';
const CLINIC_EMAIL = process.env.CLINIC_EMAIL || 'contact@ayari-dentiste.tn';
const CLINIC_PHONE = '+216 XX XXX XXX';
const CLINIC_ADDRESS = 'Tunis, Tunisie';

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #1e293b; }
  .wrapper { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%); padding: 32px 40px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
  .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
  .body { padding: 40px; }
  .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 4px; }
  .value { font-size: 15px; color: #1e293b; margin-bottom: 20px; padding: 12px 16px; background: #f1f5f9; border-radius: 8px; border-left: 3px solid #0f766e; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-confirmed { background: #dcfce7; color: #166534; }
  .footer { background: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
  .footer p { margin: 4px 0; font-size: 13px; color: #64748b; }
  .cta { display: inline-block; margin: 16px 0; padding: 14px 28px; background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>${escapeHtml(CLINIC_NAME)}</h1>
    <p>Orthodontie &amp; Soins Dentaires</p>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    <p><strong>${escapeHtml(CLINIC_NAME)}</strong></p>
    <p>${escapeHtml(CLINIC_ADDRESS)} &middot; ${escapeHtml(CLINIC_PHONE)}</p>
    <p>${escapeHtml(CLINIC_EMAIL)}</p>
  </div>
</div>
</body>
</html>`;
}

export async function sendAppointmentConfirmationToPatient(data: {
  patientName: string;
  email: string;
  selectedService: string;
  appointmentDate: Date;
  appointmentTime: string;
}): Promise<void> {
  const dateStr = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(data.appointmentDate));

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#0f766e;">Confirmation de votre rendez-vous</h2>
    <p style="color:#475569;margin:0 0 24px;">Votre demande de rendez-vous a bien été reçue. Nous vous contacterons sous peu pour confirmer votre créneau.</p>

    <p class="label">Patient</p>
    <p class="value">${escapeHtml(data.patientName)}</p>

    <p class="label">Service demandé</p>
    <p class="value">${escapeHtml(data.selectedService)}</p>

    <p class="label">Date souhaitée</p>
    <p class="value">${escapeHtml(dateStr)}</p>

    <p class="label">Heure souhaitée</p>
    <p class="value">${escapeHtml(data.appointmentTime)}</p>

    <p class="label">Statut</p>
    <p class="value"><span class="badge badge-pending">En attente de confirmation</span></p>

    <p style="color:#64748b;font-size:14px;margin-top:24px;">
      Si vous souhaitez modifier ou annuler votre rendez-vous, veuillez nous contacter directement au <strong>${escapeHtml(CLINIC_PHONE)}</strong>.
    </p>
  `;

  await transporter.sendMail({
    from: `"${CLINIC_NAME}" <${CLINIC_EMAIL}>`,
    to: data.email,
    subject: `Confirmation de rendez-vous — ${data.selectedService}`,
    html: baseTemplate(content),
  });
}

export async function sendAppointmentNotificationToAdmin(data: {
  patientName: string;
  email: string;
  phone: string;
  selectedService: string;
  appointmentDate: Date;
  appointmentTime: string;
  message?: string | null;
}): Promise<void> {
  const dateStr = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(data.appointmentDate));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#0f766e;">Nouveau rendez-vous reçu</h2>
    <p style="color:#475569;margin:0 0 24px;">Un patient vient de soumettre une demande de rendez-vous via le site web.</p>

    <p class="label">Nom du patient</p>
    <p class="value">${escapeHtml(data.patientName)}</p>

    <p class="label">Email</p>
    <p class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>

    <p class="label">Téléphone</p>
    <p class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></p>

    <p class="label">Service demandé</p>
    <p class="value">${escapeHtml(data.selectedService)}</p>

    <p class="label">Date souhaitée</p>
    <p class="value">${escapeHtml(dateStr)}</p>

    <p class="label">Heure souhaitée</p>
    <p class="value">${escapeHtml(data.appointmentTime)}</p>

    ${data.message ? `<p class="label">Message du patient</p><p class="value">${escapeHtml(data.message)}</p>` : ''}

    <a href="${escapeHtml(appUrl)}/admin/appointments" class="cta">
      Gérer ce rendez-vous →
    </a>
  `;

  await transporter.sendMail({
    from: `"Site Web Ayari Dentiste" <${CLINIC_EMAIL}>`,
    to: CLINIC_EMAIL,
    subject: `[NOUVEAU RDV] ${data.patientName} — ${data.selectedService}`,
    html: baseTemplate(content),
  });
}

export async function sendContactNotificationToAdmin(data: {
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}): Promise<void> {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#0f766e;">Nouveau message de contact</h2>
    <p style="color:#475569;margin:0 0 24px;">Un visiteur vous a envoyé un message via le formulaire de contact.</p>

    <p class="label">Nom</p>
    <p class="value">${escapeHtml(data.fullName)}</p>

    <p class="label">Email</p>
    <p class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>

    ${data.phone ? `<p class="label">Téléphone</p><p class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></p>` : ''}

    <p class="label">Sujet</p>
    <p class="value">${escapeHtml(data.subject)}</p>

    <p class="label">Message</p>
    <p class="value" style="white-space:pre-wrap;">${escapeHtml(data.message)}</p>

    <a href="mailto:${escapeHtml(data.email)}?subject=Re: ${encodeURIComponent(data.subject)}" class="cta">
      Répondre à ce message →
    </a>
  `;

  await transporter.sendMail({
    from: `"Site Web Ayari Dentiste" <${CLINIC_EMAIL}>`,
    to: CLINIC_EMAIL,
    subject: `[CONTACT] ${data.subject} — ${data.fullName}`,
    html: baseTemplate(content),
  });
}

export async function sendContactAutoReply(data: {
  fullName: string;
  email: string;
  subject: string;
}): Promise<void> {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#0f766e;">Merci pour votre message</h2>
    <p style="color:#475569;margin:0 0 24px;">Bonjour ${escapeHtml(data.fullName)},</p>
    <p style="color:#475569;">Nous avons bien reçu votre message concernant "<strong>${escapeHtml(data.subject)}</strong>".</p>
    <p style="color:#475569;">Notre équipe vous répondra dans les plus brefs délais, généralement sous 24 à 48 heures ouvrables.</p>
    <p style="color:#475569;margin-top:24px;">En cas d'urgence, vous pouvez nous contacter directement au <strong>${escapeHtml(CLINIC_PHONE)}</strong>.</p>
    <p style="color:#475569;margin-top:24px;">Cordialement,<br/><strong>L'équipe du ${escapeHtml(CLINIC_NAME)}</strong></p>
  `;

  await transporter.sendMail({
    from: `"${CLINIC_NAME}" <${CLINIC_EMAIL}>`,
    to: data.email,
    subject: `Nous avons reçu votre message — ${CLINIC_NAME}`,
    html: baseTemplate(content),
  });
}
