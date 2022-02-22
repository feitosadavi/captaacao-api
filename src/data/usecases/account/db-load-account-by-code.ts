import { LoadAccountByCodeRepository } from '@/data/protocols'
import { LoadAccountByCode } from '@/domain/usecases'

export class DbLoadAccountByCode implements LoadAccountByCode {
  constructor (private readonly loadAccountByCodeRepository: LoadAccountByCodeRepository) { }

  async load (params: LoadAccountByCode.Params): LoadAccountByCode.Result {
    const account = await this.loadAccountByCodeRepository.loadByCode(params)
    return account
  }
}
