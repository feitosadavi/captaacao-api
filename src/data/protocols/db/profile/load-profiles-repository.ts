import { LoadProfiles } from '@/domain/usecases'

export interface LoadProfilesRepository {
  loadProfiles (): Promise<LoadProfilesRepository.Result>
}

export namespace LoadProfilesRepository {
  export type Result = LoadProfiles.Result
}
