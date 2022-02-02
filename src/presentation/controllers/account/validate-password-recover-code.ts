import { LoadAccountById } from '@/domain/usecases'
import { badRequest } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

type Body = { code: number }
type Params = { id: string };

export class ValidatePassRecoverCode implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountById: LoadAccountById
  ) { }

  async handle (httpRequest: HttpRequest<Body, any, Params>): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)
    const { id } = httpRequest.params
    await this.loadAccountById.loadById(id)
    return null
  }
}
