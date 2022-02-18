import { AddProfileRepository, DeleteProfileRepository, LoadProfilesRepository, ProfileNameIsInUseRepository } from '@/data/protocols'
import { mockProfileModel } from '@tests/domain/mocks'

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

export const mockDeleteProfileRepository = (): DeleteProfileRepository => {
  class DeleteProfileRepositoryStub implements DeleteProfileRepository {
    async deleteProfile (params: DeleteProfileRepository.Params): Promise<DeleteProfileRepository.Result> {
      return Promise.resolve(true)
    }
  }
  return new DeleteProfileRepositoryStub()
}

export const mockLoadProfilesRepository = (): LoadProfilesRepository => {
  class LoadProfilesRepositoryStub implements LoadProfilesRepository {
    async loadProfiles (): Promise<LoadProfilesRepository.Result> {
      return Promise.resolve([mockProfileModel(), mockProfileModel()])
    }
  }
  return new LoadProfilesRepositoryStub()
}
