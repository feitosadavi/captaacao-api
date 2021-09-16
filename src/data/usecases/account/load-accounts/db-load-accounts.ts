import { LoadAccounts, LoadAccountsRepository, AccountModel } from './db-load-accounts-protocols'

export class DbLoadAccounts implements LoadAccounts {
  constructor (
    private readonly loadAccountsRepository: LoadAccountsRepository
  ) {}

  async load (): Promise<AccountModel[]> {
    await this.loadAccountsRepository.loadAccounts()
    return null
  }
}
