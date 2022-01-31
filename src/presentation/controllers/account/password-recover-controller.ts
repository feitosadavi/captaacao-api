import env from '@/main/config/env'
import { LoadIdByEmail, UpdateAccount } from '@/domain/usecases'
import { SendEmail } from '@/data/protocols'
import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { NotFoundAccountError, UnknownError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess, makePasswordRecoverMail } from '@/presentation/helpers'

export class PasswordRecoverController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadIdByEmail: LoadIdByEmail,
    private readonly updateAccount: UpdateAccount,
    private readonly generatePassRecoverInfo: GeneratePassRecoverInfo,
    private readonly sendEmail: SendEmail
  ) { }

  async handle (httpRequest: HttpRequest<any, any, { email: string }>): Promise<HttpResponse> {
    try {
      const email = httpRequest.body.email
      const error = this.validation.validate(email)
      if (error) return badRequest(error)

      const id = await this.loadIdByEmail.load({ email })

      if (id) {
        const recoverPassInfo = this.generatePassRecoverInfo.generate()
        const isUpdated = await this.updateAccount.update({ id, fields: { recoverPassInfo } })

        if (isUpdated) {
          const emailIsSent = await this.sendEmail.send(makePasswordRecoverMail(env.recEmail, email, recoverPassInfo.code))
          return emailIsSent ? serverSuccess({ id }) : badRequest(new UnknownError('send email'))
        } else return badRequest(new UnknownError('update account'))
      } else return badRequest(new NotFoundAccountError())
    } catch (error) {
      return serverError(error)
    }
  }
}
