import { LoadAllAccountsRepository } from '@/data/protocols'
import { LoadAllAccounts } from '@/domain/usecases'

export class DbLoadAllAccounts implements LoadAllAccounts {
  constructor (
    private readonly loadAccountsRepository: LoadAllAccountsRepository
  ) {}

  async load (): LoadAllAccounts.Result {
    const accounts = await this.loadAccountsRepository.loadAll()
    return accounts
  }
}
