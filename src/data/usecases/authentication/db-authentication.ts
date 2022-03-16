import { Authentication } from '@/domain/usecases'
import {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: Authentication.Params): Authentication.Result {
    const account = await this.loadAccountByEmailRepository.loadByEmail({ email: authentication.email })
    if (account) {
      const matchPassword = await this.hashComparer.compare(authentication.password, account.password)
      if (matchPassword) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken({ id: account.id, accessToken })
        return {
          accessToken,
          ...account
        }
      }
    }

    return null // vai retornar null pro controller, que retornará um unauthorized
  }
}
