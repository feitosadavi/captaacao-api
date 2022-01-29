import { createTransport, Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { SendEmail } from '@/data/protocols'
import { SetupEmail } from '@/data/protocols/messaging/email-setup'

export class NodemailerAdapter implements SetupEmail, SendEmail {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>

  setup (params: SetupEmail.Params): SetupEmail.Result {
    const transporter = createTransport({
      service: params.service,
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: params.user,
        pass: params.pass
      }
    })
    this.transporter = transporter
  }

  async send ({ from, to, subject, text, html }: SendEmail.Params): Promise<SendEmail.Result> {
    if (!this.transporter) return false

    const info = await this.transporter.sendMail({
      from: '"Captacao Dev Testing" <captacaodevtesting@gmail.com>',
      to: to,
      subject,
      text,
      html: html
    })
    return info.rejected.length === 0
  }
}
