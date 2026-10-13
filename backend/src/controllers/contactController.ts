import { Request, Response } from 'express';
import { z } from 'zod';
import { sendInquiryEmail } from '../services/emailService';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export async function submitContactInquiry(req: Request, res: Response): Promise<void> {
  try {
    const validated = contactSchema.parse(req.body);

    // Trigger email notification in background
    sendInquiryEmail({
      name: validated.name,
      phone: validated.phone,
      email: validated.email || undefined,
      message: validated.message,
    }).catch((err) => console.error('[ContactController] Background email failed:', err));

    res.status(200).json({
      success: true,
      message: 'Thank you! Your inquiry has been forwarded to our Bareilly store executive. We will call you back shortly.',
    });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ success: false, message: error.errors[0]?.message || 'Invalid form input' });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Error submitting inquiry' });
  }
}
