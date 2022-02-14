import { LoadAccountByIdRepository, UpdatePasswordRepository } from '@/data/protocols'
import { UpdatePassword } from '@/domain/usecases'

export class DbUpdatePassword implements UpdatePassword {
  constructor (
    private readonly updatePasswordRepository: UpdatePasswordRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) { }

  async update (params: UpdatePassword.Params): Promise<boolean> {
    const account = await this.loadAccountByIdRepository.loadById(params.id)
    let result = false
    if (account?.id) {
      result = await this.updatePasswordRepository.updatePassword(params)
    }
    return result
  }
}
