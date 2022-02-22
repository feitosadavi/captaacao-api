import { UpdateAccount } from '@/domain/usecases'
import { LoadAccountByIdRepository, UpdateAccountRepository } from '@/data/protocols'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) { }

  async update (params: UpdateAccount.Params): UpdateAccount.Result {
    const account = await this.loadAccountByIdRepository.loadById({ id: params.id })
    let result = false
    if (account?.id) {
      result = await this.updateAccountRepository.updateAccount(params)
    }
    return result
  }
}
