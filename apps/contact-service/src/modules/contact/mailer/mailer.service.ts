import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

interface MailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private templates: Record<string, handlebars.TemplateDelegate> = {};

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASSWORD');

    if (!host || !port || !user || !pass) {
      throw new Error('Missing required SMTP configuration');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  private loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    
    // Admin notification template
    const adminTemplate = fs.readFileSync(
      path.join(templatesDir, 'admin-notification.hbs'),
      'utf-8'
    );
    this.templates['admin-notification'] = handlebars.compile(adminTemplate);

    // Auto-reply template
    const autoReplyTemplate = fs.readFileSync(
      path.join(templatesDir, 'auto-reply.hbs'),
      'utf-8'
    );
    this.templates['auto-reply'] = handlebars.compile(autoReplyTemplate);
  }

  async sendMail(options: MailOptions): Promise<void> {
    const { to, subject, template, context } = options;
    const html = this.templates[template](context);
    const from = this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER');

    if (!from) {
      throw new Error('Missing SMTP_FROM configuration');
    }

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.verify();
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
} 