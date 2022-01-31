import env from '@/main/config/env'
import { SendEmail } from '@/data/protocols'
import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { LoadIdByEmail, UpdateAccount } from '@/domain/usecases'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { makePasswordRecoverMail } from '@/presentation/helpers/email'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { UnknownError } from '@/presentation/errors/unknown-error'

export class PasswordRecoverController implements Controller {
  constructor (
    private readonly loadIdByEmail: LoadIdByEmail,
    private readonly updateAccount: UpdateAccount,
    private readonly generatePassRecoverInfo: GeneratePassRecoverInfo,
    private readonly sendEmail: SendEmail
  ) { }

  async handle (httpRequest: HttpRequest<any, any, { email: string }>): Promise<HttpResponse> {
    try {
      const email = httpRequest.body.email
      const id = await this.loadIdByEmail.load({ email })
      if (id) {
        const recoverPassInfo = this.generatePassRecoverInfo.generate()
        const isUpdated = await this.updateAccount.update({ id, fields: { recoverPassInfo } })
        if (isUpdated) {
          const emailIsSent = await this.sendEmail.send(makePasswordRecoverMail(env.recEmail, email, recoverPassInfo.code))
          return emailIsSent ? serverSuccess({ id }) : badRequest(new UnknownError('send email'))
        } return badRequest(new UnknownError('update account'))
      } else { return badRequest(new NotFoundAccountError()) }
    } catch (error) {
      return serverError(error)
    }
  }
}
