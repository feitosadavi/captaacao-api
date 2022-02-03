import { LoadAccountByPassRecoveryCode } from '@/domain/usecases'
import { InvalidPasswordRecoveryCodeError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { CodeMatches, CodeExpiration } from '@/validation/protocols'

type Body = { code: number }
export class ValidatePassRecoverCode implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByPassRecoveryCode: LoadAccountByPassRecoveryCode,
    private readonly codeMatches: CodeMatches,
    private readonly codeExpiration: CodeExpiration
  ) {}

  async handle (httpRequest: HttpRequest<Body>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { code } = httpRequest.body
      const account = await this.loadAccountByPassRecoveryCode.load({ code })
      if (account?.recoverPassInfo) {
        const { recoverPassInfo } = account
        const codeMatches = this.codeMatches.matches({ first: recoverPassInfo.code, second: code })
        const isExpired = this.codeExpiration.isExpired({ expiresAt: recoverPassInfo.expiresAt })
        const codeIsValid = codeMatches && isExpired === false
        return codeIsValid ? serverSuccess({ ok: true }) : badRequest(new InvalidPasswordRecoveryCodeError())
      }
      return badRequest(new InvalidPasswordRecoveryCodeError())
    } catch (error) {
      return serverError(error)
    }
  }
}
