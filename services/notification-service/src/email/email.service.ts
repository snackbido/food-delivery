import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, context: any) {
    await this.mailerService.sendMail({
      from: 'food-delivery@team.service.com',
      to,
      subject,
      template,
      context: context,
    });
  }
}
