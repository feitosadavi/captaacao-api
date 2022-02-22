import { UpdatePassword } from '@/domain/usecases'
import { Hasher, UpdatePasswordRepository } from '@/data/protocols'

export class DbUpdatePassword implements UpdatePassword {
  constructor (
    private readonly hasher: Hasher,
    private readonly updatePasswordRepository: UpdatePasswordRepository
  ) { }

  async update ({ id, password }: UpdatePassword.Params): UpdatePassword.Result {
    const hashedPassword = await this.hasher.hash(password)
    const result = await this.updatePasswordRepository.updatePassword({ password: hashedPassword, id })
    return result
  }
}
