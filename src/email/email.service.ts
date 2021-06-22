import { Injectable } from '@nestjs/common';
import { Client } from 'postmark';

interface SendEmailProps {
  from: string;
  to: string;
  subject: string;
  text: string;
}

interface SendEmailTemplateProps {
  from: string;
  to: string;
  templateAlias: string;
  variables: { [id: string]: string };
}

@Injectable()
export class EmailService {
  private client: Client;
  constructor() {
    // TODO: read from config service
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

  async sendEmailTemplate(props: SendEmailTemplateProps) {
    await this.client.sendEmailWithTemplate({
      To: props.to,
      From: props.from,
      TemplateAlias: props.templateAlias,
      TemplateModel: props.variables,
    });
  }
}
