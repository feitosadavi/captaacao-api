import { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, serverSuccess } from '@/presentation/helpers'
import { HttpResponse, Middleware } from '@/presentation/protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly profile: string,
    private readonly checkId?: boolean
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken, id } = request // pega o accessToken que eu coloquei nos headers

      if (accessToken) {
        const account = await this.loadAccountByToken.load({ accessToken, profile: this.profile })
        if (account) {
          if (this.checkId) {
            if (account.profile === 'admin' || account.id === id) {
              return serverSuccess({ accountId: account.id })
            } else {
              return forbidden(new AccessDeniedError())
            }
          }

          return serverSuccess({ accountId: account.id }) // retorna o id da conta encontrada com o accessToken e coloca no body da resposta do middleware
        }
      }
      return forbidden(new AccessDeniedError()) // se não achar um conta com o accessToken ou não tiver o accessToken, retorna acesso negado
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
    id?: string
  }
}
