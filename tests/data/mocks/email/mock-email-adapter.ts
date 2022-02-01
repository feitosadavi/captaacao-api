import { SendEmailRepository } from '@/data/protocols'

export const mockSendEmailRepository = (): SendEmailRepository => {
  class SendEmailRepositoryStub implements SendEmailRepository {
    async send (params: SendEmailRepository.Params): Promise<SendEmailRepository.Result> {
      return Promise.resolve(true)
    }
  }
  return new SendEmailRepositoryStub()
}
