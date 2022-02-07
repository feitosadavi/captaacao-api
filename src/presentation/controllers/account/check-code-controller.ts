import { LoadAccountByCode } from '@/domain/usecases'
import { InvalidCodeError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { CodeMatches, CodeExpiration } from '@/validation/protocols'

type Body = { code: number }
export class CheckCodeController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByCode: LoadAccountByCode,
    private readonly codeMatches: CodeMatches,
    private readonly codeExpiration: CodeExpiration
  ) {}

  async handle (httpRequest: HttpRequest<Body>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { code: requestCode } = httpRequest.body
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