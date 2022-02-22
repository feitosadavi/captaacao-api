import { LoadAccountByEmailRepository } from '@/data/protocols'
import { LoadIdByEmail } from '@/domain/usecases'

export class DbLoadIdByEmail implements LoadIdByEmail {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async load (params: LoadIdByEmail.Params): LoadIdByEmail.Result {
    const account = await this.loadAccountByEmailRepository.loadByEmail(params)
    return account?.id || null
  }
}
