import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (params: LoadAccountByToken.Params): LoadAccountByToken.Result {
    const isValidToken = await this.decrypter.decrypt(params.accessToken)

    if (isValidToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(params)
      if (account) {
        return account
      }
    }
    return null
  }
}
