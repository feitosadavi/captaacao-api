import { ProfileModel } from '@/domain/models'
import { AddProfile, DeleteProfile, LoadProfiles } from '@/domain/usecases'

import { mockProfileModels } from '@tests/domain/mocks'

export const mockAddProfile = (): AddProfile => {
  class AddProfileStub implements AddProfile {
    async add (params: AddProfile.Params): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddProfileStub()
}

export const mockDeleteProfile = (): DeleteProfile => {
  class DeleteProfileStub implements DeleteProfile {
    async delete (): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteProfileStub()
}

export const mockLoadProfiles = (): LoadProfiles => {
  class LoadProfilesStub implements LoadProfilesStub {
    async load (): Promise<ProfileModel[]> {
      return Promise.resolve(mockProfileModels())
    }
  }
  return new LoadProfilesStub()
}
