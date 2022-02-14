import { Hasher, LoadAccountByIdRepository, UpdatePasswordRepository } from '@/data/protocols'
import { UpdatePassword } from '@/domain/usecases'

export class DbUpdatePassword implements UpdatePassword {
  constructor (
    private readonly hasher: Hasher,
    private readonly updatePasswordRepository: UpdatePasswordRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) { }

  async update ({ id, password }: UpdatePassword.Params): Promise<boolean> {
    const hashedPassword = await this.hasher.hash(password)
    const account = await this.loadAccountByIdRepository.loadById(id)
    let result = false
    if (account?.id) {
      result = await this.updatePasswordRepository.updatePassword({ password: hashedPassword, id })
    }
    return result
  }
}
