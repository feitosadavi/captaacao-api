import { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, serverSuccess } from '@/presentation/helpers'
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role: string,
    private readonly checkId?: boolean
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'] // pega o accessToken que eu coloquei nos headers

      if (accessToken) {
        const account = await this.loadAccountByToken.load({ accessToken, role: this.role })
        if (account) {
          if (this.checkId) {
            const accountIdToDelete = httpRequest.params.id
            if (account.role === 'admin' || account.id === accountIdToDelete) {
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
