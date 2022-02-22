import { LoadProfiles } from '@/domain/usecases'
import { LoadProfilesRepository } from '@/data/protocols'

export class DbLoadProfiles implements LoadProfiles {
  constructor (
    private readonly loadProfilesRepository: LoadProfilesRepository
  ) {}

  async load (): Promise<LoadProfiles.Result> {
    const profiles = await this.loadProfilesRepository.loadProfiles()
    return profiles
  }
}
