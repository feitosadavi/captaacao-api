import { AddProfile } from '@/domain/usecases'

export const mockAddProfile = (): AddProfile => {
  class AddProfileStub implements AddProfile {
    async add (params: AddProfile.Params): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddProfileStub()
}
