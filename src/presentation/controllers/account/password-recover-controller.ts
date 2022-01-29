import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { LoadIdByEmail, UpdateAccount } from '@/domain/usecases'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class PasswordRecoverController implements Controller {
  constructor (
    private readonly loadIdByEmail: LoadIdByEmail,
    private readonly updateAccount: UpdateAccount,
    private readonly generatePassRecoverInfo: GeneratePassRecoverInfo
  ) { }

  async handle (httpRequest: HttpRequest<any, any, { id: string }>): Promise<HttpResponse> {
    try {
      const accountId = httpRequest.params.id
      const account = await this.loadIdByEmail.load({ id: accountId })
      if (!account) return badRequest(new NotFoundAccountError())
      const recoverPassInfo = this.generatePassRecoverInfo.generate()
      const isUpdated = await this.updateAccount.update({ id: accountId, fields: { recoverPassInfo } })
      return isUpdated && serverSuccess({ ok: true })
    } catch (error) {
      return serverError(error)
    }
  }
}
