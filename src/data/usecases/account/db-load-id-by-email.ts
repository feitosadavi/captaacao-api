import { LoadAccountByEmailRepository } from '@/data/protocols'
import { LoadIdByEmail } from '@/domain/usecases'

export class DbLoadIdByEmail implements LoadIdByEmail {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async load ({ email }: LoadIdByEmail.Params): Promise<LoadIdByEmail.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    return account?.id || null
  }
}
