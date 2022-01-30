import { SendEmail } from '@/data/protocols'

export const mockSendEmail = (): SendEmail => {
  class SendEmailStub implements SendEmail {
    async send (params: SendEmail.Params): Promise<SendEmail.Result> {
      return Promise.resolve(true)
    }
  }
  return new SendEmailStub()
}
