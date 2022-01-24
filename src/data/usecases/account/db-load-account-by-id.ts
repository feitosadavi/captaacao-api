import { LoadAccountByIdRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { LoadAccountById } from '@/domain/usecases'

export class DbLoadAccountById implements LoadAccountById {
  constructor (private readonly loadAccountByIdRepository: LoadAccountByIdRepository) { }

  async loadById (id: string): Promise<AccountModel> {
    const account = await this.loadAccountByIdRepository.loadById(id)
    return account
  }
}
