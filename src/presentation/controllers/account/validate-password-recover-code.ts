import { LoadAccountByPassRecoveryCode } from '@/domain/usecases'
import { badRequest, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

type Body = { code: number }
export class ValidatePassRecoverCode implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByPassRecoveryCode: LoadAccountByPassRecoveryCode
  ) {}

  async handle (httpRequest: HttpRequest<Body>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { code } = httpRequest.body
      await this.loadAccountByPassRecoveryCode.load({ code })
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
