import { createTransport, Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { SendEmailRepository, SetupEmailRepository } from '@/data/protocols'

export class NodemailerAdapter implements SetupEmailRepository, SendEmailRepository {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>

  setup (params: SetupEmailRepository.Params): SetupEmailRepository.Result {
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

  async send ({ from, to, subject, text, html }: SendEmailRepository.Params): Promise<SendEmailRepository.Result> {
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
