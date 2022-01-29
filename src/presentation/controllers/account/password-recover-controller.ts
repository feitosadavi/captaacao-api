import { LoadAccountById } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class PasswordRecoverController implements Controller {
  constructor (private readonly loadAccountById: LoadAccountById) {}

  async handle (httpRequest: HttpRequest<any, any, {id: string}>): Promise<HttpResponse> {
    const accountId = httpRequest.params.id
    await this.loadAccountById.loadById(accountId)
    return null
  }
}
