import nodemailer from 'nodemailer';
import { config } from '../config';

function getTransporter() {
  if (!config.email.pass) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
}

export interface InquiryData {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export async function sendInquiryEmail(data: InquiryData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(
      `[EmailService] Inquiry received from ${data.name} (${data.phone}). Note: EMAIL_PASS is not set, email dispatch skipped.`
    );
    return false;
  }

  try {
    const mailOptions = {
      from: config.email.from,
      to: config.email.user,
      subject: `🔔 New Store Inquiry from ${data.name} (${data.phone}) - Arora Mobile Hub`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f9fa; padding: 24px; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 24px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 800;">Arora Mobile Hub — Customer Inquiry</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">C-15 Ekta Nagar, Bareilly, Uttar Pradesh</p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 14px; margin-top: 0;">You have received a new customer inquiry from the online store:</p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #64748b;">Customer Name:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Phone / WhatsApp:</td>
                  <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #7c3aed; font-weight: bold; text-decoration: none;">${data.phone}</a></td>
                </tr>
                ${
                  data.email
                    ? `<tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Customer Email:</td>
                        <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #7c3aed; text-decoration: none;">${data.email}</a></td>
                      </tr>`
                    : ''
                }
              </table>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #7c3aed; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                <strong style="display: block; margin-bottom: 4px; color: #334155;">Customer Message:</strong>
                <span>${data.message.replace(/\n/g, '<br/>')}</span>
              </div>
              <div style="text-align: center; margin-top: 24px;">
                <a href="tel:${data.phone}" style="display: inline-block; padding: 10px 20px; background: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">
                  Call Customer Directly (${data.phone})
                </a>
              </div>
            </div>
            <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              Arora Mobiles and Gadget Hub &bull; GSTIN: 09DIYPA1147P1ZK &bull; Bareilly, UP
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Inquiry email successfully sent to ${config.email.user}`);

    // If customer provided an email address, send an auto-acknowledgment
    if (data.email) {
      try {
        await transporter.sendMail({
          from: config.email.from,
          to: data.email,
          subject: `Inquiry Received - Arora Mobile Hub, Bareilly`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f7f9fa; padding: 24px; color: #1e293b;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #7c3aed; padding: 20px; color: #ffffff; text-align: center;">
                  <h2 style="margin: 0; font-size: 18px;">Thank You for Contacting Arora Mobile Hub</h2>
                </div>
                <div style="padding: 24px; font-size: 13px; line-height: 1.6;">
                  <p>Hello <strong>${data.name}</strong>,</p>
                  <p>We have received your message regarding: <em>"${data.message}"</em>.</p>
                  <p>Our store executive at C-15 Ekta Nagar, Bareilly will get in touch with you shortly on <strong>${data.phone}</strong>.</p>
                  <p>For urgent assistance, feel free to call us directly at <a href="tel:+917300791957" style="color: #7c3aed; font-weight: bold;">+91 73007 91957</a> or WhatsApp us.</p>
                  <br/>
                  <p style="margin: 0; color: #64748b;">Best regards,<br/><strong>Arora Mobile Hub Team</strong><br/>Bareilly, Uttar Pradesh</p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (err) {
        // Customer ack failure is non-blocking
      }
    }

    return true;
  } catch (error: any) {
    console.error('[EmailService] Error sending inquiry email:', error?.message);
    return false;
  }
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(
      `[EmailService] Order ${data.orderNumber} placed for ${data.customerName}. Note: EMAIL_PASS is not set, email dispatch skipped.`
    );
    return false;
  }

  try {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${item.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; font-weight: bold;">₹${item.price.toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const mailOptions = {
      from: config.email.from,
      to: data.customerEmail,
      cc: config.email.user, // Store owner also receives a copy
      subject: `Order Confirmation #${data.orderNumber} - Arora Mobile Hub`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f9fa; padding: 24px; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 24px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Order Confirmed!</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Order #${data.orderNumber}</p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 14px; margin-top: 0;">Hello <strong>${data.customerName}</strong>,</p>
              <p style="font-size: 13px; color: #475569; line-height: 1.6;">
                Thank you for your purchase at Arora Mobile Hub. We have received your order and our Bareilly warehouse team is preparing it for dispatch.
              </p>

              <div style="margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f8fafc; font-size: 12px; color: #64748b; text-transform: uppercase;">
                      <th style="padding: 10px; text-align: left;">Product</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr style="background: #f8fafc; font-weight: bold; font-size: 14px;">
                      <td colspan="2" style="padding: 12px 10px; text-align: right; color: #0f172a;">Total Payable:</td>
                      <td style="padding: 12px 10px; text-align: right; color: #7c3aed;">₹${data.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              ${
                data.shippingAddress
                  ? `
                <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; font-size: 12px; color: #334155; margin-bottom: 20px;">
                  <strong style="display: block; margin-bottom: 4px; color: #0f172a;">Delivery Destination:</strong>
                  <span>${data.shippingAddress.addressLine}, ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pinCode}</span>
                </div>
              `
                  : ''
              }

              <p style="font-size: 12px; color: #64748b; margin-top: 20px; line-height: 1.6;">
                For order tracking or support, reply directly to this email or call us at <strong>+91 73007 91957</strong>.<br/>
                Showroom: C-15 Ekta Nagar, Bareilly, Uttar Pradesh, 243122.
              </p>
            </div>
            <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              Arora Mobiles and Gadget Hub &bull; GSTIN: 09DIYPA1147P1ZK &bull; https://aroramobilesandgadgethub.com
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Order confirmation sent for ${data.orderNumber} to ${data.customerEmail}`);
    return true;
  } catch (error: any) {
    console.error('[EmailService] Error sending order confirmation email:', error?.message);
    return false;
  }
}
