import { AddProfileRepository, CheckProfileByNameRepository } from '@/data/protocols'

export const mockAddProfileRepositoryStub = (): AddProfileRepository => {
  class AddProfileStubRepository implements AddProfileRepository {
    // eslint-disable-next-line @typescript-eslint/require-await
    async add (params: AddProfileRepository.Params): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddProfileStubRepository()
}

export const mockCheckProfileByNameRepository = (): CheckProfileByNameRepository => {
  class CheckProfileByNameRepositoryStub implements CheckProfileByNameRepository {
    async checkByName (params: CheckProfileByNameRepository.Params): Promise<CheckProfileByNameRepository.Result> {
      return Promise.resolve(false)
    }
  }
  return new CheckProfileByNameRepositoryStub()
}
