import { AddProfileRepository, CheckProfileByNameRepository } from '@/data/protocols'
import { AddProfile } from '@/domain/usecases'

export class DbAddProfile implements AddProfile {
  constructor (
    private readonly checkProfileByName: CheckProfileByNameRepository,
    private readonly addProfileRepository: AddProfileRepository
  ) { }

  async add (params: AddProfile.Params): Promise<boolean> {
    const profileExists = await this.checkProfileByName.checkByName({ name: params.name })
    let isValid = false
    if (!profileExists) {
      isValid = await this.addProfileRepository.add({ ...params })
    }
    return isValid
  }
}
