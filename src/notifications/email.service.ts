import { Injectable } from '@nestjs/common';
import { Client } from 'postmark';

interface SendEmailProps {
  from: string;
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class EmailService {
  private client: Client;
  constructor() {
    this.client = new Client(process.env.POSTMARK_API_KEY);
  }

  async sendEmail(props: SendEmailProps) {
    await this.client.sendEmail({
      To: props.to,
      From: props.from,
      Subject: props.subject,
      TextBody: props.text,
    });
  }
}
