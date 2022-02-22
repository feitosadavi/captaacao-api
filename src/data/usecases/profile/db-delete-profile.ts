import { DeleteProfile } from '@/domain/usecases'
import { DeleteProfileRepository } from '@/data/protocols'

export class DbDeleteProfile implements DeleteProfile {
  constructor (
    private readonly deleteProfileRepository: DeleteProfileRepository
  ) { }

  async delete ({ id }: DeleteProfile.Params): Promise<DeleteProfile.Result> {
    const deleteResult = await this.deleteProfileRepository.deleteProfile({ id })
    return deleteResult
  }
}
