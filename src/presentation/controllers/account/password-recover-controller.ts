import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { LoadIdByEmail, UpdateAccount } from '@/domain/usecases'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { badRequest } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class PasswordRecoverController implements Controller {
  constructor (
    private readonly loadIdByEmail: LoadIdByEmail,
    private readonly updateAccount: UpdateAccount,
    private readonly generatePassRecoverInfo: GeneratePassRecoverInfo
  ) { }

  async handle (httpRequest: HttpRequest<any, any, {id: string}>): Promise<HttpResponse> {
    const accountId = httpRequest.params.id
    const account = await this.loadIdByEmail.load({ id: accountId })
    if (!account) return badRequest(new NotFoundAccountError())
    const recoverPassInfo = this.generatePassRecoverInfo.generate()
    await this.updateAccount.update({ id: accountId, fields: { recoverPassInfo } })
    return null
  }
}
