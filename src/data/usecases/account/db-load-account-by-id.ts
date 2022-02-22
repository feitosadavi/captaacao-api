import { LoadAccountByIdRepository } from '@/data/protocols'
import { LoadAccountById } from '@/domain/usecases'

export class DbLoadAccountById implements LoadAccountById {
  constructor (private readonly loadAccountByIdRepository: LoadAccountByIdRepository) { }

  async load (params: LoadAccountById.Params): LoadAccountById.Result {
    const account = await this.loadAccountByIdRepository.loadById(params)
    return account
  }
}
