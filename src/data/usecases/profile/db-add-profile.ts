import { AddProfile } from '@/domain/usecases'
import { AddProfileRepository, ProfileNameIsInUseRepository } from '@/data/protocols'

export class DbAddProfile implements AddProfile {
  constructor (
    private readonly profileNameIsInUse: ProfileNameIsInUseRepository,
    private readonly addProfileRepository: AddProfileRepository
  ) { }

  async add (params: AddProfile.Params): Promise<boolean> {
    const profileExists = await this.profileNameIsInUse.nameIsInUse({ name: params.name })
    let isValid = false
    if (!profileExists) {
      isValid = await this.addProfileRepository.add(params)
    }
    return isValid
  }
}
