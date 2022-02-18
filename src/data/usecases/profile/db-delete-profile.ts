import { DeleteProfileRepository } from '@/data/protocols'
import { DeleteProfile } from '@/domain/usecases'

export class DbDeleteProfile implements DeleteProfile {
  constructor (
    private readonly deleteProfileRepository: DeleteProfileRepository
  ) { }

  async delete ({ id }: DeleteProfile.Params): Promise<DeleteProfile.Result> {
    const deleteResult = await this.deleteProfileRepository.delete({ id })
    return deleteResult
  }
}
