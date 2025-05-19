import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submitContact(@Body() contactData: ContactDto): Promise<{ message: string }> {
    await this.contactService.handleContactRequest(contactData);
    return { message: 'Your message has been sent successfully' };
  }
} 