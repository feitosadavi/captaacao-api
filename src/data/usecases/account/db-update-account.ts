import { LoadAccountByIdRepository, UpdateAccountRepository } from '@/data/protocols'
import { UpdateAccount } from '@/domain/usecases'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) { }

  async update (params: UpdateAccount.Params): Promise<boolean> {
    const account = await this.loadAccountByIdRepository.loadById(params.id)
    let result = false
    if (account?.id) {
      result = await this.updateAccountRepository.updateAccount(params)
    }
    return result
  }
}
