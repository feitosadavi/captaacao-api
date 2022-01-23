import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id'

export class DbLoadAccountById implements LoadAccountById {
  constructor (private readonly loadAccountByIdRepository: LoadAccountByIdRepository) { }

  async loadById (id: string): Promise<AccountModel> {
    const account = await this.loadAccountByIdRepository.loadById(id)
    return account
  }
}
