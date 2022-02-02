import { LoadAccountById } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class ValidatePassRecoverCode implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountById: LoadAccountById
  ) { }

  async handle (httpRequest: HttpRequest<{ accountId: string, code: number }>): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    await null
    return null
  }
}
