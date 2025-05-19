import { Injectable } from '@nestjs/common';
import { MailerService } from './mailer/mailer.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailerService: MailerService) {}

  async handleContactRequest(contactData: ContactDto): Promise<void> {
    const { name, email, subject, message } = contactData;

    // Send email to admin
    await this.mailerService.sendMail({
      to: 'imigrate01@gmail.com',
      subject: `Contact Form: ${subject}`,
      template: 'admin-notification',
      context: {
        name,
        email,
        subject,
        message,
      },
    });

    // Send auto-reply to user
    await this.mailerService.sendMail({
      to: email,
      subject: 'Thank you for contacting Bailey\'s Kitchen',
      template: 'auto-reply',
      context: {
        name,
        subject,
        message,
      },
    });
  }
} 