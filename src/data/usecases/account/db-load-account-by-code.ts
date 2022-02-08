import { LoadAccountByCodeRepository } from '@/data/protocols'
import { LoadAccountByCode } from '@/domain/usecases'

export class DbLoadAccountByCode implements LoadAccountByCode {
  constructor (private readonly loadAccountByCodeRepository: LoadAccountByCodeRepository) { }

  async load ({ code }: LoadAccountByCode.Params): Promise<LoadAccountByCode.Result> {
    const account = await this.loadAccountByCodeRepository.loadByCode({ code })
    return account
  }
}
