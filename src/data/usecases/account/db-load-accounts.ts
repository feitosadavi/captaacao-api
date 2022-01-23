import { LoadAccountsRepository } from '@/data/protocols'
import { LoadAccounts } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

export class DbLoadAccounts implements LoadAccounts {
  constructor (
    private readonly loadAccountsRepository: LoadAccountsRepository
  ) {}

  async load (): Promise<AccountModel[]> {
    const accounts = await this.loadAccountsRepository.loadAccounts()
    return accounts
  }
}
