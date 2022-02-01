import env from '@/main/config/env'
import { SendEmailRepository, UpdateAccountRepository } from '@/data/protocols'
import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { PasswordRecover } from '@/domain/usecases'
import { makePasswordRecoverMail } from '@/data/helpers'

export class DbPasswordRecover implements PasswordRecover {
  constructor (
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly generatePassRecoverInfo: GeneratePassRecoverInfo,
    private readonly sendEmail: SendEmailRepository
  ) { }

  async recover ({ id, email }: PasswordRecover.Params): Promise<PasswordRecover.Result> {
    const recoverPassInfo = this.generatePassRecoverInfo.generate()
    const isUpdated = await this.updateAccountRepository.updateAccount({ id, fields: { recoverPassInfo } })

    if (isUpdated) {
      const emailIsSent = await this.sendEmail.send(makePasswordRecoverMail(env.recEmail, email, recoverPassInfo.code))
      return emailIsSent
    } else {
      return false
    }
  }
}
