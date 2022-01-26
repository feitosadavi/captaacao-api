import { UpdateAccountRepository } from '@/data/protocols'
import { LoadAccountById, UpdateAccount } from '@/domain/usecases'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly loadAccountById: LoadAccountById
  ) { }

  async update (params: UpdateAccount.Params): Promise<boolean> {
    const account = await this.loadAccountById.loadById(params.id)
    let result = false
    if (account?.id) {
      result = await this.updateAccountRepository.update(params.fields)
    }
    return result
  }
}
