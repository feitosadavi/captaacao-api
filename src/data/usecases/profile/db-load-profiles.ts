import { LoadProfilesRepository } from '@/data/protocols'
import { LoadProfiles } from '@/domain/usecases'

export class DbLoadProfiles implements LoadProfiles {
  constructor (
    private readonly loadProfilesRepository: LoadProfilesRepository
  ) {}

  async load (): Promise<LoadProfiles.Result> {
    const profiles = await this.loadProfilesRepository.loadProfiles()
    return profiles
  }
}
