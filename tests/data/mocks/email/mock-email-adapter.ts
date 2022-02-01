import { SendEmailRepository, SetupEmailRepository } from '@/data/protocols'

export const mockSendEmailRepository = (): SendEmailRepository => {
  class SendEmailRepositoryStub implements SendEmailRepository {
    async send (params: SendEmailRepository.Params): Promise<SendEmailRepository.Result> {
      return Promise.resolve(true)
    }
  }
  return new SendEmailRepositoryStub()
}

export const mockSetupEmailRepository = (): SetupEmailRepository => {
  class SetupEmailRepositoryStub implements SetupEmailRepository {
    setup (params: SetupEmailRepository.Params): SetupEmailRepository.Result {
      return null
    }
  }
  return new SetupEmailRepositoryStub()
}
