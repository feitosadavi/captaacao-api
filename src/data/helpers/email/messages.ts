import { SendEmailRepository } from '@/data/protocols'

export const makePasswordRecoverMail = (from: string, to: string, number: number): SendEmailRepository.Params => ({
  from,
  to,
  subject: 'Redefinição de senha',
  text: `Aqui está o seu código de redefinição de senha: ${number}`
  // VOCE PRECISA TESTAR ESTA FUNÇÃO
  // html?: string
})
