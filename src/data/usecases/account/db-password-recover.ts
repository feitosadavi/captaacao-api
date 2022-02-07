import env from '@/main/config/env'
import { SendEmailRepository, UpdateAccountRepository } from '@/data/protocols'
import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { PasswordRecover } from '@/domain/usecases'
import { makePasswordRecoverMail } from '@/data/helpers'
import { SetupEmailRepository } from '@/data/protocols/messaging/setup-email'

export class DbPasswordRecover implements PasswordRecover {
  constructor (
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly generatePassRecoverInfo: GeneratePassRecoverInfo,
    private readonly sendEmail: SendEmailRepository,
    private readonly setupEmail: SetupEmailRepository// TESTAR O SETUP EMAIL
  ) { }

  async recover ({ id, email }: PasswordRecover.Params): Promise<PasswordRecover.Result> {
    const code = this.generatePassRecoverInfo.generate()
    const isUpdated = await this.updateAccountRepository.updateAccount({ id, fields: { code } })
    if (isUpdated) {
      await this.setupEmail.setup({
        service: 'gmail',
        user: env.recEmail,
        pass: env.recEmailPassword
      })
      const emailIsSent = await this.sendEmail.send(makePasswordRecoverMail(env.recEmail, email, code.number))
      console.log(emailIsSent)
      return emailIsSent
    } else {
      return false
    }
  }
}
