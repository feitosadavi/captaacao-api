import { SendEmailRepository } from '@/data/protocols/messaging'
import { SetupEmail } from '@/data/protocols/messaging/email-setup'
import { NodemailerAdapter } from '@/infra/messaging'
import env from '@/main/config/env'

type SutType = {
  sut: NodemailerAdapter
}

const makeSut = (): SutType => {
  const sut = new NodemailerAdapter()
  return { sut }
}

const mockEmailParams = (): SendEmailRepository.Params => ({
  from: `"any_name" <${env.testingEmail1}>`,
  to: env.testingEmail2,
  subject: 'Recuperação da Senha - Captação',
  text: 'Aqui está o código para a recuperação da sua senha: 123'
})

const mockSetupParams = (): SetupEmail.Params => ({
  service: 'gmail',
  user: env.testingEmail1,
  pass: env.testingEmailPassword1
})

describe('NodemailerAdapter', () => {
  test('Should return false if setup was not executed', async () => {
    const { sut } = makeSut()
    const result = await sut.send(mockEmailParams())
    expect(result).toBe(false)
  })

  test('Should return true if email was sent correctly', async () => {
    const { sut } = makeSut()
    sut.setup(mockSetupParams())
    const result = await sut.send(mockEmailParams())
    expect(result).toBe(true)
  })
})
