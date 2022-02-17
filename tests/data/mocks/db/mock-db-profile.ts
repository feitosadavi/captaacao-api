import { AddProfileRepository, ProfileNameIsInUseRepository } from '@/data/protocols'

export const mockAddProfileRepositoryStub = (): AddProfileRepository => {
  class AddProfileStubRepository implements AddProfileRepository {
    // eslint-disable-next-line @typescript-eslint/require-await
    async add (params: AddProfileRepository.Params): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddProfileStubRepository()
}

export const mockProfileNameIsInUseRepository = (): ProfileNameIsInUseRepository => {
  class ProfileNameIsInUseRepositoryStub implements ProfileNameIsInUseRepository {
    async nameIsInUse (params: ProfileNameIsInUseRepository.Params): Promise<ProfileNameIsInUseRepository.Result> {
      return Promise.resolve(false)
    }
  }
  return new ProfileNameIsInUseRepositoryStub()
}
