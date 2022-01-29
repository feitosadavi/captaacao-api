import { LoadAccountByEmailRepository } from '@/data/protocols'
import { LoadIdByEmail } from '@/domain/usecases'

export class DbLoadIdByEmail implements LoadIdByEmail {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async load ({ id }: LoadIdByEmail.Params): Promise<LoadIdByEmail.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(id)
    return account?.id || null
  }
}
