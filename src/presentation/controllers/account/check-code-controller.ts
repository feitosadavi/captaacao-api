import { LoadAccountByCode } from '@/domain/usecases'
import { InvalidCodeError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { CodeMatches, CodeExpiration } from '@/validation/protocols'

export class CheckCodeController implements Controller<CheckCodeController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByCode: LoadAccountByCode,
    private readonly codeMatches: CodeMatches,
    private readonly codeExpiration: CodeExpiration
  ) {}

  async handle (request: CheckCodeController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { code: requestCode } = request
      const account = await this.loadAccountByCode.load({ code: requestCode })
      if (account?.code) {
        const { code } = account
        const codeMatches = this.codeMatches.matches({ first: code.number, second: requestCode })
        const isExpired = this.codeExpiration.isExpired({ expiresAt: code.expiresAt })
        const codeIsValid = codeMatches && isExpired === false
        return codeIsValid ? serverSuccess({ ok: true }) : badRequest(new InvalidCodeError())
      }
      return badRequest(new InvalidCodeError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace CheckCodeController {
  export type Request = {
    code: number
  }
}
