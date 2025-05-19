import { EmailData } from '@/types/email';
import { API_CONFIG } from '@/config/api';

export async function sendContactEmail(data: EmailData): Promise<void> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send email');
  }
} 